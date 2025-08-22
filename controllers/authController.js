const bcrypt = require('bcrypt');
const userDB = require('../models/User');
const jwt = require('jsonwebtoken')
const passGenerator = require('generate-password');
const crypto = require("crypto");
const ResetToken = require('../models/ResetToken');
const sendEmail = require('../utils/emails/sendEmail')
const validatePasswordComplexity = require('../utils/validation/password')
require('dotenv').config()

const SALT_ROUNDS = 12;
var COOKIE_OPTIONS = { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "None", secure: true, domain: process.env.DOMAIN }

if (process.env.NODE_ENV === 'dev')
    COOKIE_OPTIONS = { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, domain: process.env.DOMAIN }


const register = async (req, res, next) => {
    var { Email, StudentNo, Staff, roles, academicYear } = req.body
    var password = passGenerator.generate({
        length: 10,
        numbers: true
    })

    const user = await userDB.findOne({
        $or: [
            { Email: Email },
            { StudentNo: StudentNo }]
    })

    if (user) return res.status(409).json({ "message": "Email or Student Number already in use." })

    if (!roles) {
        roles = Staff ? ["staff"] : ["student"]
    }

    if (!academicYear) {
        let today = new Date(Date.now());
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        var startYear, endYear;

        if (month > 8) {
            startYear = year
            endYear = startYear + 1
        } else {
            startYear = year - 1
            endYear = year
        }
        academicYear = `${startYear}/${endYear.toString().substring(2)}`

    }

    bcrypt.hash(password, SALT_ROUNDS).then((async hash => {
        return await userDB.create({ Email: Email, StudentNo: StudentNo || null, Password: hash, TempPassword: true, AcademicYear: academicYear, Roles: roles })
    })).then((newUser) => {

        const link = `${process.env.DOMAIN}/login`;
        sendEmail(newUser.Email, "Welcome!", { studentNo: StudentNo, password: password, link: link, }, "./template/welcome.hbs");
        return res.json({ "message": "Welcome email sent!" });

    }).catch((err) => {
        res.status(500).json({ "message": err.message })

    })

}


const login = async (req, res) => {
    const cookies = req.cookies;
    var { identifier, password } = req.body
    if (!identifier || !password) return res.status(400).json({ "message": "Email Address/Student Number and Password are required" })

    const user = await userDB.findOne(
        {
            $or: [
                { Email: identifier },
                { StudentNo: identifier }]
        })
    if (!user) return res.status(404).json({ "message": "The Email Address/Student Number or Password that was entered is incorrect" })

    if (user.LoginAttempts >= 3) return res.status(403).json({ "message": "Account locked please reset password." })

    bcrypt.compare(password, user.Password).then(async (match) => {
        if (!match) {
            await userDB.findByIdAndUpdate(user._id, { LoginAttempts: user.LoginAttempts + 1 || 1 })
            return res.status(401).json({ "message": "The Email Address/Student Number or Password that was entered is incorrect" })
        }
        const accessToken = jwt.sign(
            {
                "email": user.Email,
                "roles": user.Roles,
                "studentNo": user.StudentNo,
                "tempPassword": user.TempPassword
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        )
        const newRefreshToken = jwt.sign(
            {
                "email": user.Email,
                "roles": user.Roles,
                "studentNo": user.StudentNo,
                "tempPassword": user.TempPassword
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        const newRefreshTokenArray = !cookies?.authjwt ? user.RefreshToken : user.RefreshToken.filter(rt => rt !== cookies.authjwt);

        if (cookies?.authjwt) res.clearCookie('authjwt', COOKIE_OPTIONS);

        user.RefreshToken = [...newRefreshTokenArray, newRefreshToken];
        user.LoginAttempts = 0;
        await user.save();

        res.cookie('authjwt', newRefreshToken, COOKIE_OPTIONS)
        res.cookie('refreshExists', true, { maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: true })
        res.json({ accessToken })
    }).catch((err) => {
        res.json(err.message)
    })
}

const requestReset = async (req, res) => {
    const { identifier } = req.body;

    if (!identifier) {
        return res.status(400).json({ "message": "Email Address is required" });
    }

    try {
        const user = await userDB.findOne({ Email: identifier });

        if (!user) {
            return res.status(404).json({ "message": "Incorrect Email Address." });
        }

        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, SALT_ROUNDS);

        await ResetToken.deleteOne({ userId: user._id })

        const newResetToken = new ResetToken({ userId: user._id, token: hash })
        newResetToken.save()



        const link = `${process.env.DOMAIN}/update-password?token=${resetToken}&id=${user._id}`;
        sendEmail(user.Email, "Password Reset Request", { studentNo: user.StudentNo, link: link, }, "./template/requestResetPassword.hbs");
        return res.json({ "message": "Reset email sent!" });
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

const updatePassword = async (req, res) => {
    const { resetToken, email, userId, password } = req.body;

    const cookies = req.cookies;   
    const refreshToken = cookies.authjwt;

    if ((!resetToken && !email) || !password) {
        return res.status(400).json({ "message": "Email Address or Reset token and Password are required" });
    }

    try {
        const passwordResetToken = await ResetToken.findOne({ userId: userId });

        const user = await userDB.findOne({
            $or: [
                { Email: email },
                { _id: userId }
            ]
        });

        if (!user || !passwordResetToken) {
            return res.status(400).json({ "message": "Incorrect Email Address or reset token" });
        }

        if (!email) {
            const isTokenValid = await bcrypt.compare(resetToken, passwordResetToken.token);
            if (!isTokenValid) {
                return res.status(400).json({ "message": "Token is invalid." });
            }
        }

        const isPasswordInvalid = validatePasswordComplexity(password)
        if (isPasswordInvalid) {
            return res.status(400).json({ "message": isPasswordInvalid });
        }


        const match = await bcrypt.compare(password, user.Password);
        if (match) {
            return res.status(400).json({ "message": "To help protect your account, please choose a new password that you haven't used before." });
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        user.Password = hash;
        user.ResetToken = null;
        user.LoginAttempts = 0;
        user.TempPassword = false;
        user.RefreshToken = [refreshToken];
        await user.save();
        if (passwordResetToken)
            await passwordResetToken.deleteOne();
        res.json({ "message": "Success" });
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
};



const refresh = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.authjwt) return res.sendStatus(401)
    const refreshToken = cookies.authjwt;
    res.clearCookie('authjwt', COOKIE_OPTIONS)
    res.clearCookie('refreshExists', true, { maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: true })
    const user = await userDB.findOne({ RefreshToken: { $in: [refreshToken] } }).exec();

    if (!user) {
        console.log("didn't find user")
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);
                const hackedUser = await userDB.findOne({ Email: decoded.email }).exec();
                if (hackedUser) {
                    hackedUser.RefreshToken = [];
                    await hackedUser.save();
                }
            })
        return res.sendStatus(403);
    }

    const newRefreshTokenArray = user.RefreshToken.filter(rt => rt !== refreshToken)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                user.RefreshToken = newRefreshTokenArray;
                await user.save();
            }
            if (err && user.Email !== decoded.email) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {
                    "email": user.Email,
                    "roles": user.Roles,
                    "studentNo": user.StudentNo,
                    "tempPassword": user.TempPassword
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            )

            const newRefreshToken = jwt.sign(
                {
                    "email": user.Email,
                    "roles": user.Roles,
                    "studentNo": user.StudentNo,
                    "tempPassword": user.TempPassword
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            )

            user.RefreshToken = [...newRefreshTokenArray, newRefreshToken];
            user.LoginAttempts = 0;
            await user.save();

            res.cookie('authjwt', newRefreshToken, COOKIE_OPTIONS)
            res.cookie('refreshExists', true, { maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: true })
            res.json({ accessToken })
        }
    )

}


const logout = async (req, res) => {

    const cookies = req.cookies;

    if (!cookies?.authjwt) return res.sendStatus(204)
    const refreshToken = cookies.authjwt;

    const user = await userDB.findOne({ RefreshToken: { $in: [refreshToken] } }).exec();
    if (!user) {
        res.clearCookie('authjwt', COOKIE_OPTIONS)
        return res.sendStatus(204);
    }

    user.RefreshToken = user.RefreshToken.filter(rt => rt !== refreshToken)
    await user.save();
    res.clearCookie('authjwt', COOKIE_OPTIONS)
    return res.sendStatus(204);

}

const logoutEverywhere = async (req, res) => {

    const cookies = req.cookies;

    if (!cookies?.authjwt) return res.sendStatus(204)
    const refreshToken = cookies.authjwt;

    const user = await userDB.findOne({ RefreshToken: { $in: [refreshToken] } }).exec();
    if (!user) {
        res.clearCookie('authjwt', COOKIE_OPTIONS)
        return res.sendStatus(204);
    }

    user.RefreshToken = []
    await user.save();
    res.clearCookie('authjwt', COOKIE_OPTIONS)
    return res.sendStatus(204);

}


module.exports = { register, login, requestReset, updatePassword, refresh, logout, logoutEverywhere }
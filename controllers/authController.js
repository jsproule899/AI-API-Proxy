const bcrypt = require('bcrypt');
const userDB = require('../models/User');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const SALT_ROUNDS = 12;
var COOKIE_OPTIONS = { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: true }

if (process.env.NODE_ENV === 'dev')
    COOKIE_OPTIONS = { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }


const register = (req, res, next) => {
    var { password } = req.body

    bcrypt.hash(password, SALT_ROUNDS).then((async hash => {
        return await userDB.create({ ...req.body, Password: hash })
    })).then(() => {
        //TODO generate & send access token
    }).catch((err) => {
        res.json(err.message)
        next()
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
                "studentNo": user.StudentNo
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        )
        const newRefreshToken = jwt.sign(
            {
                "email": user.Email,
                "roles": user.Roles,
                "studentNo": user.StudentNo
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        const newRefreshTokenArray = !cookies?.authjwt ? user.RefreshToken : user.RefreshToken.filter(rt => rt !== cookies.authjwt);

        if (cookies?.authjwt) res.clearCookie('authjwt',COOKIE_OPTIONS);

        user.RefreshToken = [...newRefreshTokenArray, newRefreshToken];
        user.LoginAttempts = 0;
        await user.save();

        res.cookie('authjwt', newRefreshToken, COOKIE_OPTIONS)
        res.cookie('refreshExists', true, {maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: true })
        res.json({ accessToken })
    }).catch((err) => {
        res.json(err.message)
    })
}


const refresh = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.authjwt) return res.sendStatus(401)
    const refreshToken = cookies.authjwt;
    res.clearCookie('authjwt',COOKIE_OPTIONS)
    res.clearCookie('refreshExists', true, {maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: true })
    const user = await userDB.findOne({ RefreshToken: { $in: [refreshToken] } }).exec();

    if (!user) {
        console.log("didn't find user")
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);
                const hackedUser = await userDB.findOne({ Email: decoded.email }).exec();
                hackedUser.RefreshToken = [];
                await hackedUser.save();
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
                    "studentNo": user.StudentNo
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m' }
            )

            const newRefreshToken = jwt.sign(
                {
                    "email": user.Email,
                    "roles": user.Roles,
                    "studentNo": user.StudentNo
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            )

            user.RefreshToken = [...newRefreshTokenArray, newRefreshToken];
            user.LoginAttempts = 0;
            await user.save();

            res.cookie('authjwt', newRefreshToken, COOKIE_OPTIONS)
            res.cookie('refreshExists', true, {maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: true })
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


module.exports = { register, login, refresh, logout }
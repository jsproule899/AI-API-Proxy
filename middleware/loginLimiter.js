const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
    windowMs: 60*1000,
    max: 5,
    message: { message: 'Too many login attempts from this IP, plesase try again afer 60 seconds'},
    handler: (req, res, next, options) =>{
        res.status(options.StatusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders: true,
})

module.exports = loginLimiter
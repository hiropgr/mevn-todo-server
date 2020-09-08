const {body} = require('express-validator');
const User = require('../models/User');

exports.registerValidator = [
    body('email')
        .isEmail().withMessage('Incorrect email value')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({ email: value });
                if(user)
                    return Promise.reject('Email is already in use')
            } catch (error) {
                console.log(errr);
            }
        })
        .normalizeEmail(),
    body('name', 'Min length of name is 3 symbols, max is 30')
        .isLength({min: '3', max: '30'})
        .trim(),
    body('password', 'Incorrect format of password')
        .isLength({min: 8, max: 36})
        .isAlphanumeric()
        .trim(),
]
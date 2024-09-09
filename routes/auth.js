const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/signup', authController.getSignUp);

router.post('/signup', [
    body('username').trim().not().isEmpty().withMessage('Username cannot be empty')
    .custom((value, {req}) => {
        return User.findByUsername(value)
        .then(([res]) => {
            if (res.length) {
                return Promise.reject('Username already Exists!!!');
            }
        });
    }),
    body('email').isEmail().withMessage('Please Enter a Valid Email')
    .custom((value, {req}) => {
        return User.findByEmail(value)
        .then(([res]) => {
            if (res.length) {
                return Promise.reject('Email already exists!!!!!!');
            }
        });
    }),
    body('password').trim().isLength({min : 8}).withMessage('Password Should be of length of minimum 8 excluding spaces')
], authController.postSignUp);

router.get('/login', authController.getLogin);

router.post('/login', [], authController.postLogin);

module.exports = router;
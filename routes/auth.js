const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('signup', authController.getSignUp);

router.post('signup', [
    body('email').isEmail().withMessage('Please Enter a Valid Email')
    .custom((value, req) => {
        return User.findByEmail(email).then(user => {
            if (user) {
                Promise.reject('Email Already Exists');
            }
        })
    })
], authController.postSignUp);

router.get('login', authController.getLogin);

router.post('login', [], authController.postLogin);

module.exports = router;
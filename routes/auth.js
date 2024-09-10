const express = require('express');
const bcrypt = require('bcrypt');
const { body } = require('express-validator');

const User = require('../models/user')

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth').isAuth;

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

router.post('/login', [
    body('email').isEmail().withMessage('Please Enter a valid Email address')
    .custom((value, {req}) => {
        return User.findByEmail(value)
        .then(([res]) => {
            if (!res.length) {
                return Promise.reject('A user with this Email could not be found');
            }
        });
    }),
    body('password').custom((value, {req}) => {
        return User.findByEmail(req.body.email)
        .then(([res]) => {
            return bcrypt.compare(value, res[0].password);
        })
        .then((isEqual) => {
            if (!isEqual) {
                return Promise.reject('Wrong Password');
            }
        });
    })
], authController.postLogin);

module.exports = router;
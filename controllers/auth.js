const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

exports.getSignUp = (req, res, next) => {
    res.status(200).json({message: 'Sign up page loaded Succesfully!!!'});
}

exports.postSignUp = (req, res, next) => {
    const error = validationResult(req);
    if (!error.empty()) {
        const err = new Error('Sign up Failed');
        err.code = 422;
        err.data = error.array();
        
        throw err;
    }

    const password = req.body.password;
    bcrypt.hash(password, 12)
    .then(hashedPw => {
        const user = new User(req.body.username, req.body.email, hashedPw);
        user.save();
    })
    .then(() => {
        res.status(201).json({message: "Signed up Seccesfully"});
    })
    .catch(err => {
        if (!err.code) {
            error.code = 500;
        }

        next(err);
    })
}

exports.getLogin = (req, res, next) => {
    res.status(200).json({message: 'Login page loaded Succesfully!!!'});
}

exports.postLogin = (req, res, next) => {
    
}
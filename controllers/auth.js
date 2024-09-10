const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.getSignUp = (req, res, next) => {
    res.status(200).json({message: 'Sign up page loaded Succesfully!!!'});
}

exports.postSignUp = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const err = new Error('Sign up Failed');
        err.code = 422;
        err.data = error.array()[0].msg;
        
        throw err;
    }


    bcrypt.hash(req.body.password, 12)
    .then(hashedPw => {
        const user = new User(req.body.username, req.body.email, hashedPw);
        return user.save();
    })
    .then(([result]) => {
        console.log(result);
        res.status(201).json({message: "Signed up Seccesfully"});
    })
    .catch(err => {
        if (!err.code) {
            err.code = 500;
        }

        next(err);
    })
}

exports.getLogin = (req, res, next) => {
    res.status(200).json({message: 'Login page loaded Succesfully!!!'});
}

exports.postLogin = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const err = new Error('Login failed');
        err.code = 401;
        err.data = error.array()[0].msg;

        throw err;
    }

    User.findByEmail(req.body.email)
    .then(([result]) => {
        const token = jwt.sign(
            {
                email: req.body.email,
                userId: result[0].id
            }, 'somesecret',
            {expiresIn: '10h'}
        );
    
        res.status(200).json({message: 'Successfully logged in', token: token});
    })
    .catch((err) => {
        if (!err.code) {
            err.code = 500;
        }

        next(err);
    });
}
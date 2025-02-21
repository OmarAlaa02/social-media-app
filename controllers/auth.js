const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');

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
            if (!result.length) {
                const err = new Error('Invalid email or password');
                err.code = 401;
                throw err;
            }

            console.log(result);
            const token = jwt.sign(
                {
                    email: req.body.email,
                    username: result[0].username,
                    userId: result[0].id,
                },
                'somesecret',
                { expiresIn: '10h' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 10 * 60 * 60 * 1000 
            });

            res.status(200).json({message: "Successfully logged in"});
        })
        .catch((err) => {
            if (!err.code) {
                err.code = 500;
            }

            next(err);
        });
};

exports.getLogin = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(200).json({message: "Not Logged In"});
        return;
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesecret');
    } catch (err) {
        err.code = 401; 
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Token not verified');
        error.code = 401;
        throw error;
    }

    const imgUrlResult = await User.getProfilePicture(decodedToken.userId);
    const imgUrl = imgUrlResult[0][0]?.imgUrl;
    const formattedImgUrl = imgUrl ? imgUrl.replace(/\\/g, '/') : null;

    res.status(200).json({message: "Authorized",
        email: decodedToken.email, 
        userId: decodedToken.userId, 
        username: decodedToken.username,
        imgUrl: formattedImgUrl});
}

exports.postLogout = (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true, 
        secure: true,    
        sameSite: 'None',
        maxAge: 0        
    });
    
    res.status(200).json({ message: 'Successfully logged out'});
}
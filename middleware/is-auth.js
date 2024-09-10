const jwt = require('jsonwebtoken');

exports.isAuth = (req, res, next) => {
    const token = req.get('Authorization');
    if (!token) {
        const error = new Error('Not Authenticated');
        error.code = 401;

        throw error;
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesecret');
    } catch (err) {
        err.code = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Not Authenticated');
        error.code = 401;

        throw error;
    }

    req.email = decodedToken.email;
    req.userId = decodedToken.userId;
    next();
}
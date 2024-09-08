const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());

app.use('auth', authRoutes);

app.use((error, req, res, next) => {
    res.status(error.code).json({message: error.message, data: error.data});
});

app.listen(3000);
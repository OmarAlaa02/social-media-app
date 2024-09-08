const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    res.status(error.code).json({message: error.message, data: error.data});
});

app.listen(3000,()=>console.log('listening on port 3000'));
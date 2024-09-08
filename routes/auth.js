const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();

router.get('signup');

router.post('signup');

router.get('login');

router.post('login');

module.exports = router;
const express = require('express');

const { index } = require('./indexRoute');


const router = express.Router();
router.get('/', index);

module.exports = router;

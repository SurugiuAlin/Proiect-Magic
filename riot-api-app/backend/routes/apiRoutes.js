const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const accountRoutes = require('./account');

router.use('/auth', authRoutes);
router.use('/account', accountRoutes);

module.exports = router; 
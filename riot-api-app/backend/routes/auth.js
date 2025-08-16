const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { jsonResponse, generateJWT } = require('../utils');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return jsonResponse(res, false, 400, [], 'Username or email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const responseData = {
            message: 'User registered successfully',
            username: user.username
        };

        return jsonResponse(res, true, 200, responseData, 'User registered successfully');

    } catch (error) {
        console.error('Register error:', error);
        return jsonResponse(res, false, 500, [], 'Server error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return jsonResponse(res, false, 400, [], 'Invalid username or password');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return jsonResponse(res, false, 400, [], 'Invalid username or password');
        }

        const token = generateJWT({ userId: user._id, username: user.username });

        const responseData = {
            message: 'Login successful',
            token,
            username: user.username
        };

        return jsonResponse(res, true, 200, responseData, 'Login successful');

    } catch (error) {
        console.error('Login error:', error);
        return jsonResponse(res, false, 500, [], 'Server error');
    }
});

module.exports = router; 
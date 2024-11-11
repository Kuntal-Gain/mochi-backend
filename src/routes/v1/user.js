const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// Register - POST v1/user/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                text: "Username, email and password are required"
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                text: "User already exists"
            });
        }

        // Create new user with only required fields
        const user = new User({
            username,
            email,
            password,
            history: [],
            readingList: [],
            favouriteManga: [],
            timeSpent: 0
        });

        await user.save();
        res.status(201).json({ text: "User is Created" });

    } catch (error) {
        res.status(500).json({ text: error.message });
    }
});

// Login - POST v1/user/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                text: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                text: "Invalid credentials"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                text: "Invalid credentials"
            });
        }

        // Return the raw credentials that need to be used for Basic auth
        res.json({
            text: "User is Logged In",
            token: Buffer.from(`${email}:${password}`).toString('base64'),
            authType: "Basic"
        });

    } catch (error) {
        res.status(500).json({ text: error.message });
    }
});

// Fetch User - GET v1/user/fetchUser
router.get('/fetchUser', auth, async (req, res) => {
    try {
        // Since we attached the user in middleware, we can access it directly
        const user = req.user;

        // Create response object without sensitive information
        const userResponse = {
            username: user.username,
            email: user.email,
            history: user.history,
            readingList: user.readingList,
            favouriteManga: user.favouriteManga,
            timeSpent: user.timeSpent
        };

        res.json(userResponse);

    } catch (error) {
        res.status(500).json({ text: error.message });
    }
});

// Logout - POST v1/user/logout
router.post('/logout', auth, async (req, res) => {
    try {
        // Since we're using Basic Auth, we just send a successful logout message
        // The client side should handle removing the stored credentials
        res.json({
            text: "User is Logged Out"
        });
    } catch (error) {
        res.status(500).json({ text: error.message });
    }
});

module.exports = router; 
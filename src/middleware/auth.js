const User = require('../models/User');
const bcrypt = require('bcryptjs');

const authMiddleware = async (req, res, next) => {
    try {
        // Get Authorization header
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ text: 'Authorization header required' });
        }

        // Check if it's Basic auth
        if (!authHeader.startsWith('Basic ')) {
            return res.status(401).json({ text: 'Basic authentication required' });
        }

        // Get base64 credentials (remove 'Basic ' prefix)
        const base64Credentials = authHeader.split(' ')[1];

        // Decode credentials
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        if (!email || !password) {
            return res.status(401).json({ text: 'Invalid authorization format' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ text: 'User not found' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ text: 'Invalid credentials' });
        }

        // Attach user to request
        req.user = user;
        next();

    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ text: 'Authentication failed' });
    }
};

module.exports = authMiddleware; 
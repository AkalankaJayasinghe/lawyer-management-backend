const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };

    const options = {
        expiresIn: '1h' // Token expiration time
    };

    return jwt.sign(payload, config.JWT_SECRET, options);
};

module.exports = generateToken;
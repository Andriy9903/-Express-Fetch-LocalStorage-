// auth.js
const crypto = require('crypto');

/**
 * Хешує пароль за допомогою SHA-256.
 * @param {string} password
 * @returns {string}
 */
function encodePassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * @param {string} email
 * @returns {string}
 */
function generateToken(email) {
    const timestamp = Date.now().toString();
    return crypto.createHash('sha256').update(email + timestamp).digest('hex');
}

module.exports = { encodePassword, generateToken };

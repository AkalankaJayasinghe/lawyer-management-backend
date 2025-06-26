const path = require('path');

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/lawyer_management',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'your_email_service',
    EMAIL_USERNAME: process.env.EMAIL_USERNAME || process.env.EMAIL_USER || 'your_email@example.com',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || 'your_email_password',
    PDF_STORAGE_PATH: process.env.PDF_STORAGE_PATH || path.join(__dirname, '..', 'uploads', 'pdfs'),
    UPLOADS_PATH: process.env.UPLOADS_PATH || path.join(__dirname, '..', 'uploads'),
    SUMMARIES_PATH: process.env.SUMMARIES_PATH || path.join(__dirname, '..', 'uploads', 'summaries')
};
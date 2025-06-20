module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/lawyer_management',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'your_email_service',
    EMAIL_USER: process.env.EMAIL_USER || 'your_email@example.com',
    EMAIL_PASS: process.env.EMAIL_PASS || 'your_email_password',
    PDF_STORAGE_PATH: process.env.PDF_STORAGE_PATH || './uploads/pdfs',
    UPLOADS_PATH: process.env.UPLOADS_PATH || './uploads',
};
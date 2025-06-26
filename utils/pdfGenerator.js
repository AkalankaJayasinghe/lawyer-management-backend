const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Static directory names
let uploadsPath = path.join(__dirname, '..', 'document_uploads');
let summariesPath = path.join(uploadsPath, 'summaries');

// Create directories if they don't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

try {
  ensureDirectoryExists(uploadsPath);
  ensureDirectoryExists(summariesPath);
} catch (error) {
  // Fallback in case of error
  uploadsPath = path.join(__dirname, '..', 'temp_uploads');
  summariesPath = path.join(uploadsPath, 'summaries');
  try {
    ensureDirectoryExists(uploadsPath);
    ensureDirectoryExists(summariesPath);
  } catch (fallbackError) {
    console.error('Failed to create fallback directories:', fallbackError);
  }
}

const generatePDF = (data, filename) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filePath = path.join(summariesPath, filename);

      // Ensure directory exists
      ensureDirectoryExists(path.dirname(filePath));

      // Pipe PDF to write stream
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // PDF Content
      doc.fontSize(25).text('Case Summary', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Title: ${data.title || ''}`);
      doc.text(`Client: ${data.clientName || ''}`);
      doc.text(`Lawyer: ${data.lawyerName || ''}`);
      doc.text(`Date: ${data.date || ''}`);
      doc.text(`Duration: ${data.duration || ''}`);
      doc.text(`Fee: ${data.fee || ''}`);
      doc.text(`Description: ${data.description || ''}`);

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };
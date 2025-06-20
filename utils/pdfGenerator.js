const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Ensure uploads/summaries directory exists
const dir = path.join(__dirname, '../uploads/summaries');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const generatePDF = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const {
        title,
        clientName,
        lawyerName,
        date,
        duration,
        fee,
        description
      } = data;

      const formattedDate = new Date(date).toLocaleDateString();
      const filePath = path.join(dir, `summary_${Date.now()}.pdf`);
      
      // Create PDF document
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // Add header
      doc.fontSize(20).text('Consultation Summary', {
        align: 'center'
      });
      
      doc.moveDown();
      doc.fontSize(16).text(title, { align: 'center' });
      
      doc.moveDown();
      
      // Add content
      doc.fontSize(12).text(`Client: ${clientName}`);
      doc.fontSize(12).text(`Lawyer: ${lawyerName}`);
      doc.fontSize(12).text(`Date: ${formattedDate}`);
      doc.fontSize(12).text(`Duration: ${duration} minutes`);
      doc.fontSize(12).text(`Fee: $${fee.toFixed(2)}`);
      
      doc.moveDown();
      doc.fontSize(14).text('Case Description:');
      doc.fontSize(12).text(description);
      
      doc.moveDown();
      
      // Add footer with date
      doc.fontSize(10).text(`Generated on ${new Date().toLocaleString()}`, {
        align: 'center'
      });
      
      // Finalize the PDF
      doc.end();
      
      stream.on('finish', () => {
        resolve(filePath);
      });
      
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generatePDF;
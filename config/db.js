const mongoose = require('mongoose');

// Add this line:
mongoose.set('strictQuery', false); // or true, depending on your preference

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
module.exports = connectDB;
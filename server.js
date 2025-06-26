const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const lawyerRoutes = require('./routes/lawyerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const documentRoutes = require('./routes/documentRoutes');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/documents', documentRoutes);

// Error handling middleware (should be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Socket.io setup for real-time messaging
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Join a room (for private messaging)
  socket.on('join', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Handle message sending
  socket.on('sendMessage', (message) => {
    io.to(message.roomId).emit('receiveMessage', message);
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('userTyping', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
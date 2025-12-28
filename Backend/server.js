const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/child-auth', require('./routes/childAuthRoutes'));
app.use('/api/children', require('./routes/childrenRoutes'));
app.use('/api/gifts', require('./routes/giftRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/elves', require('./routes/elfRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Socket.io for real-time messaging
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_room', (room) => {
    socket.join(room);
  });
  
  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🎄 Connected to MongoDB - Santa\'s Database is ready!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Santa\'s Workshop is running! 🎅' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🎅 Santa's Workshop Backend running on port ${PORT}`);
});

module.exports = { app, io };
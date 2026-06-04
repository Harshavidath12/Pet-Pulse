require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const appointmentRoutes = require('./routes/appointments');
const petsRoutes = require('./routes/pets');
const doctorsRoutes = require('./routes/doctors');
const notificationsRoutes = require('./routes/notifications');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'PetPulse API is running 🐾', timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 PetPulse Server running on http://localhost:${PORT}`);
  
  // Seed admin user if it doesn't exist
  try {
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin@123', // Will be hashed by pre-save hook
        role: 'admin'
      });
      console.log('✅ Admin user seeded (admin@gmail.com)');
    }

    // Seed mock Doctors if they don't exist
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      const doctorsToSeed = [
        { name: 'Dr. Smith', specialties: ['Comprehensive Pain Control', 'Advanced Anesthesia'], contact: 'smith@petpulse.com' },
        { name: 'Dr. Rohan Silva', specialties: ['Dental Services', 'Companion Animal Surgery'], contact: 'rohan@petpulse.com' },
        { name: 'Dr. Amara Perera', specialties: ['Companion Animal Medical Services', 'Laboratory Services'], contact: 'amara@petpulse.com' },
        { name: 'Dr. James Equine', specialties: ['Equine Services', '24 Hour Emergency Service'], contact: 'james@petpulse.com' },
      ];
      await Doctor.insertMany(doctorsToSeed);
      console.log('✅ Mock Doctors seeded');
    }
  } catch (error) {
    console.error('Failed to seed DB:', error);
  }
});

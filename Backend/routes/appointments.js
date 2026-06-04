const express = require('express');
const Appointment = require('../models/Appointment');
const Pet = require('../models/Pet');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/appointments/check-conflict
// @desc    Check if a doctor is available at a given date & time (1-hour slot assumption)
// @access  Public
router.get('/check-conflict', async (req, res) => {
  try {
    const { doctorId, date, time } = req.query;
    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: 'doctorId, date and time are required' });
    }

    // Parse the requested time into minutes from midnight
    const [reqHour, reqMin] = time.split(':').map(Number);
    const reqMinutes = reqHour * 60 + reqMin;

    // Find existing confirmed/pending appointments for this doctor on this date
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const existing = await Appointment.find({
      vet: doctorId,
      date: { $gte: dayStart, $lte: dayEnd },
      status: { $in: ['pending', 'confirmed'] },
    });

    // Check if any existing appointment overlaps (within 1 hour window)
    let conflict = null;
    for (const appt of existing) {
      const [apptHour, apptMin] = appt.time.split(':').map(Number);
      const apptMinutes = apptHour * 60 + apptMin;
      const diff = Math.abs(reqMinutes - apptMinutes);
      if (diff < 60) {
        conflict = appt;
        break;
      }
    }

    if (conflict) {
      // Suggest next available time: 1 hour after the conflicting slot
      const [cHour, cMin] = conflict.time.split(':').map(Number);
      let nextHour = cHour + 1;
      const nextTime = `${String(nextHour).padStart(2, '0')}:${String(cMin).padStart(2, '0')}`;
      return res.json({
        conflict: true,
        conflictTime: conflict.time,
        nextAvailableTime: nextTime,
        message: `Doctor is already booked at ${conflict.time}. Please select ${nextTime} or later.`,
      });
    }

    res.json({ conflict: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/appointments/pets
// @desc    Get logged in user's pets (for dropdown)
// @access  Private
router.get('/pets', protect, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @route   GET /api/appointments/my
// @desc    Get all appointments for the logged-in user
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ owner: req.user._id })
      .populate('pet', 'name species breed')
      .populate('vet', 'name specialties')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { pet, vet, date, time, reason, serviceType, notes } = req.body;

    // Use the doctor selected by user, or auto-assign by specialty as fallback
    let assignedDoctor = vet ? await Doctor.findById(vet) : null;
    if (!assignedDoctor) {
      assignedDoctor = await Doctor.findOne({ specialties: serviceType });
    }
    if (!assignedDoctor) {
      assignedDoctor = await Doctor.findOne();
    }

    const appointment = await Appointment.create({
      owner: req.user._id,
      pet,
      vet: assignedDoctor ? assignedDoctor._id : null,
      date,
      time,
      reason,
      serviceType,
      notes,
    });

    // Populate for the response
    const populated = await Appointment.findById(appointment._id)
      .populate('pet', 'name species breed')
      .populate('vet', 'name specialties');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


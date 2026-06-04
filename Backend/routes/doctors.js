const express = require('express');
const Doctor = require('../models/Doctor');

const router = express.Router();

// @route   GET /api/doctors?specialty=<serviceType>
// @desc    Get doctors filtered by specialty (or all if no specialty given)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { specialty } = req.query;
    const query = specialty ? { specialties: specialty } : {};
    const doctors = await Doctor.find(query).select('name specialties contact');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const ContactInquiry = require('../models/ContactInquiry');

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a contact inquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const inquiry = await ContactInquiry.create({ name, email, message });
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

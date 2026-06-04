const express = require('express');
const ContactInquiry = require('../models/ContactInquiry');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { protect, admin } = require('../middleware/authMiddleware');
const { sendReplyEmail } = require('../utils/emailService');

const router = express.Router();

// @route   GET /api/admin/inquiries
// @desc    Get all contact inquiries
// @access  Private/Admin
router.get('/inquiries', protect, admin, async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/inquiries/:id/reply
// @desc    Reply to a contact inquiry
// @access  Private/Admin
router.post('/inquiries/:id/reply', protect, admin, async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const inquiry = await ContactInquiry.findById(req.params.id);

    if (inquiry) {
      inquiry.adminReply = replyMessage;
      inquiry.status = 'replied';
      const updatedInquiry = await inquiry.save();
      
      // Send real email to the user
      try {
        await sendReplyEmail(
          inquiry.email,
          inquiry.name,
          inquiry.message,
          replyMessage
        );
        console.log(`✅ Reply email sent to ${inquiry.email}`);
      } catch (emailErr) {
        console.error('⚠️ Email sending failed (reply still saved):', emailErr.message);
      }

      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/appointments
// @desc    Get all appointments (with conflict detection)
// @access  Private/Admin
router.get('/appointments', protect, admin, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('owner', 'name email')
      .populate('pet', 'name species breed')
      .populate('vet', 'name specialties')
      .sort({ date: 1, time: 1 });

    // Conflict detection logic
    const confirmedAppts = appointments.filter(a => a.status === 'confirmed');
    
    const apptsWithConflicts = appointments.map(appt => {
      let hasConflict = false;
      let conflictMsg = '';

      if (appt.status === 'pending' && appt.vet) {
        // Check if there is a confirmed appointment for the same vet, date, and time
        const conflict = confirmedAppts.find(
          c => c.vet && c.vet._id.toString() === appt.vet._id.toString() &&
               new Date(c.date).toDateString() === new Date(appt.date).toDateString() &&
               c.time === appt.time
        );
        
        if (conflict) {
          hasConflict = true;
          conflictMsg = `Conflict: ${appt.vet.name} already has a confirmed appointment at this time.`;
        }
      }

      return {
        ...appt.toObject(),
        hasConflict,
        conflictMsg
      };
    });

    res.json(apptsWithConflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/appointments/:id/status
// @desc    Update appointment status (approve/decline)
// @access  Private/Admin
router.put('/appointments/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id).populate('pet');

    if (appointment) {
      appointment.status = status;
      const updatedAppointment = await appointment.save();

      // If declined/cancelled, create a notification for the user
      if (status === 'declined') {
        const Notification = require('../models/Notification');
        await Notification.create({
          user: appointment.owner,
          message: `Your appointment for ${appointment.pet?.name || 'your pet'} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been cancelled.`,
          relatedAppointment: appointment._id
        });
      }

      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

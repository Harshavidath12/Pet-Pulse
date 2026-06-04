const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    vet: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    reason: { type: String, required: true },
    serviceType: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String },
    fee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);

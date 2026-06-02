const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    species: { type: String, enum: ['dog', 'cat', 'bird', 'rabbit', 'exotic', 'other'], required: true },
    breed: { type: String },
    age: { type: Number },
    weight: { type: Number },
    gender: { type: String, enum: ['male', 'female'] },
    color: { type: String },
    microchipId: { type: String },
    vaccinations: [
      {
        name: String,
        date: Date,
        nextDue: Date,
      },
    ],
    medicalHistory: [
      {
        condition: String,
        diagnosis: Date,
        notes: String,
      },
    ],
    profileImage: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pet', petSchema);

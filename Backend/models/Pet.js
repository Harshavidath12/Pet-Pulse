const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    owner:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:             { type: String, required: true, trim: true },
    species:          { type: String, enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Exotic', 'Other'], required: true },
    breed:            { type: String, trim: true },
    age:              { type: Number },
    dob:              { type: Date },
    weight:           { type: Number },
    gender:           { type: String, enum: ['Male', 'Female'] },
    color:            { type: String },
    isVaccinated:     { type: Boolean, default: false },
    isMicrochipped:   { type: Boolean, default: false },
    isSpayedNeutered: { type: Boolean, default: false },
    isIndoor:         { type: Boolean, default: false },
    profileImage:     { type: String, default: '' },
    notes:            { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pet', petSchema);

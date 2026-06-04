const express = require('express');
const Pet = require('../models/Pet');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/pets
// @desc    Get all pets for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/pets
// @desc    Add a new pet
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name, species, breed, age, dob, weight, gender, color,
      isVaccinated, isMicrochipped, isSpayedNeutered, isIndoor, notes
    } = req.body;

    const pet = await Pet.create({
      owner: req.user._id,
      name, species, breed, age, dob, weight, gender, color,
      isVaccinated, isMicrochipped, isSpayedNeutered, isIndoor, notes
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/pets/:id
// @desc    Update a pet
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    Object.assign(pet, req.body);
    const updated = await pet.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/pets/:id
// @desc    Delete a pet
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json({ message: 'Pet removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

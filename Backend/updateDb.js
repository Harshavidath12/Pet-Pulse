require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

async function updateDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const result = await Appointment.updateMany(
      { status: 'pending' },
      { $set: { status: 'confirmed' } }
    );
    console.log(`Updated ${result.modifiedCount} pending appointments to confirmed.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateDb();

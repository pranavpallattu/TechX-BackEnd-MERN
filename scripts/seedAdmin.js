const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../Model/userModel'); // Adjust path based on your directory structure
require('dotenv').config()

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin', 10);
    const admin = new User({
      username: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user seeded successfully');
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();

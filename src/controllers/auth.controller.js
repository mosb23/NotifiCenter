const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); 
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const { registerSchema } = require('../validators/user.validator');


exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // ✅ Validate input
    const { error } = registerSchema.validate({ username, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Hash password manually
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.profile = (req, res) => {
  res.json({ message: 'Welcome to your profile', user: req.user });
};

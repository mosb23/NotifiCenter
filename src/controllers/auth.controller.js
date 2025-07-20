const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); 
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const { registerSchema } = require('../validators/user.validator');
const ApiResponse = require('../core/apiResponse');
const ApiError = require('../core/apiError');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    // ✅ Validate input
    const { error } = registerSchema.validate({ username, password });
    if (error) {
      throw ApiError.badRequest(error.details[0].message);
    }

    const exists = await User.findOne({ username });
    if (exists) {
   throw ApiError.conflict('User already exists')
      }

    // ✅ Hash password manually
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json(
      ApiResponse.created(null, 'User registered successfully')
    ); 
   } catch (err) {
    next(err); // Pass to error handler
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw ApiError.unauthorized();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.jwtSecret,
      { expiresIn:config.jwtExpiresIn }
    );

    res.json(ApiResponse.success({ token }, 'Login successful'));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.profile = (req, res) => {
  res.json(ApiResponse.success(
    { user: req.user }
  ))};

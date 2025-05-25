// Step 1 - Task 2: Import necessary packages
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');

dotenv.config(); // Load environment variables from .env

const router = express.Router();

// Step 1 - Task 3: Create a Pino logger instance
const logger = pino();

// Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Step 2: Create register endpoint
router.post('/register', async (req, res) => {
  try {
    // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
    const db = await connectToDatabase();

    // Task 2: Access MongoDB collection
    const collection = db.collection('users');

    // Task 3: Check for existing email
    const existingEmail = await collection.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    // Task 4: Save user details in database
    const newUser = await collection.insertOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });

    // Task 5: Create JWT authentication with user._id as payload
    const payload = {
      user: {
        id: newUser.insertedId,
      },
    };

    const authtoken = jwt.sign(payload, JWT_SECRET);

    logger.info('User registered successfully');

    res.json({ authtoken, email: req.body.email });
  } catch (e) {
    logger.error('Internal server error', e);
    return res.status(500).send('Internal server error');
  }
});

router.post('/login', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');

    const theUser = await collection.findOne({ email: req.body.email });

    if (theUser) {
      const result = await bcryptjs.compare(req.body.password, theUser.password);
      if (!result) {
        return res.status(404).json({ error: 'Wrong password' });
      }

      const userName = theUser.firstName;
      const userEmail = theUser.email;

      const payload = {
        user: {
          id: theUser._id.toString(),
        },
      };

      const authtoken = jwt.sign(payload, JWT_SECRET);
      res.json({ authtoken, userName, userEmail });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (e) {
    return res.status(500).send('Internal server error');
  }
});

router.put(
  '/update',
  [
    // Example validations - adjust fields as needed
    body('name').optional().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
  ],
  async (req, res) => {
    // Task 2: Validate input and return errors if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors in update request', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Task 3: Check if email is present in headers
      const email = req.headers.email;
      if (!email) {
        console.error('Email not found in the request headers');
        return res.status(400).json({ error: 'Email not found in the request headers' });
      }

      // Task 4: Connect to MongoDB and access collection
      const db = await connectToDatabase();
      const collection = db.collection('users');

      // Task 5: Find existing user credentials
      const existingUser = await collection.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update existingUser fields with data from req.body if provided
      const updates = req.body;
      Object.keys(updates).forEach((key) => {
        existingUser[key] = updates[key];
      });

      existingUser.updatedAt = new Date();

      // Task 6: Update user credentials in database and get updated document
      const updatedUserResult = await collection.findOneAndUpdate(
        { email },
        { $set: existingUser },
        { returnDocument: 'after' }
      );

      const updatedUser = updatedUserResult.value;

      // Task 7: Create JWT with user._id as payload using secret from .env
      const payload = {
        user: {
          id: updatedUser._id.toString(),
        },
      };

      const authtoken = jwt.sign(payload, JWT_SECRET);

      // Send back the token (you can also send updated user info if needed)
      res.json({ authtoken });
    } catch (e) {
      console.error('Internal server error in /update:', e.message);
      res.status(500).send('Internal server error');
    }
  }
);

module.exports = router;

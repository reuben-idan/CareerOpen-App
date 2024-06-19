// src/controllers/authController.js
import { genSalt, hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import User, { findOne, findById } from './userModel';








export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generate a JWT token
    const token = sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
}

export async function getAuthenticatedUser(req, res) {
  try {
    const user = await findById(req.user.userId);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error getting authenticated user', error });
  }
}
/**
 * authController.js
 * ---------------------------------------
 * Handles authentication logic
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel.js";

const SALT_ROUNDS = 10;

/* =========================================
   REGISTER USER
========================================= */
export async function register(req, res) {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Save user
    const user = await createUser(name, email, hashedPassword, role);

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
}

/* =========================================
   LOGIN USER
========================================= */
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
}
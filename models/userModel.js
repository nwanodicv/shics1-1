/**
 * userModel.js
 * ---------------------------------------
 * Handles database queries for users
 */

import { pool } from "../database/index.js";

/* =========================================
   CREATE USER
========================================= */
export async function createUser(name, email, password, role) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, password, role]
  );

  return result.rows[0];
}

/* =========================================
   FIND USER BY EMAIL
========================================= */
export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0];
}
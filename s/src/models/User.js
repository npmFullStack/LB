// src/models/User.js
import pool from "./index.js";
import bcrypt from "bcryptjs";

const User = {
    // Create a new user
    create: async userData => {
        const { firstName, lastName, email, password, avatarUrl, bio } =
            userData;
        const passwordHash = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (first_name, last_name, email, password_hash, avatar_url, bio)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, first_name, last_name, email, avatar_url, bio, created_at
        `;
        const values = [
            firstName,
            lastName,
            email,
            passwordHash,
            avatarUrl || null,
            bio || null
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Find user by email
    findByEmail: async email => {
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    // Find user by ID
    findById: async id => {
        const query = `
            SELECT id, first_name, last_name, email, avatar_url, bio, created_at, updated_at
            FROM users WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Update user profile
    update: async (id, updateData) => {
        const { firstName, lastName, bio, avatarUrl } = updateData;
        const query = `
            UPDATE users 
            SET first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                bio = COALESCE($3, bio),
                avatar_url = COALESCE($4, avatar_url),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING id, first_name, last_name, email, avatar_url, bio, updated_at
        `;
        const values = [firstName, lastName, bio, avatarUrl, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Verify password
    verifyPassword: async (user, password) => {
        return await bcrypt.compare(password, user.password_hash);
    }
};

export default User;

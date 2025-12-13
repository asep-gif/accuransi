require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

/**
 * A command-line script to create a new admin user.
 *
 * Usage:
 * node create-admin.js <username> <password>
 *
 * Example:
 * node create-admin.js newadmin securepassword123
 */

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const createAdminUser = async () => {
    const [username, password] = process.argv.slice(2);

    if (!username || !password) {
        console.error('Error: Please provide both a username and a password.');
        console.log('Usage: node create-admin.js <username> <password>');
        process.exit(1);
    }

    try {
        // Check if the user already exists
        const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        if (existingUser.rowCount > 0) {
            console.error(`Error: A user with the username "${username}" already exists.`);
            return;
        }

        // Hash the password
        const passwordHash = bcrypt.hashSync(password, 10);
        const role = 'admin';

        // Insert the new user into the database
        await pool.query(
            'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
            [username, passwordHash, role]
        );

        console.log(`✅ Successfully created admin user: "${username}"`);
    } catch (err) {
        console.error('Failed to create admin user:', err);
    } finally {
        await pool.end(); // Close the database connection
    }
};

createAdminUser();
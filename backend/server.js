require('dotenv').config(); // This must be at the very top
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('express-async-errors'); // Must be imported before your routes
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

// Use the secret from the .env file
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in the .env file.");
    process.exit(1);
}

// Middleware
app.use(cors()); // Allows requests from your frontend
app.use(express.json()); // Parses incoming JSON requests

// --- AUTHENTICATION ---

// Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (user && bcrypt.compareSync(password, user.password_hash)) {
        // Credentials are correct, generate a JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role }, // Payload
            JWT_SECRET,
            { expiresIn: '8h' } // Token expires in 8 hours
        );
        return res.json({ token });
    }

    res.status(401).json({ message: 'Invalid username or password' });
});

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden (invalid token)
        req.user = user;
        next();
    });
};

// GET all partners
app.get('/api/partners', async (req, res) => {
    const allPartners = await db.query('SELECT * FROM partners ORDER BY id ASC');
    res.json(allPartners.rows);
});

// POST a new partner
app.post('/api/partners', authMiddleware, async (req, res) => {
    const { name, logo_url } = req.body;
    if (!name || !logo_url) {
        return res.status(400).json({ error: 'Name and logo URL are required.' });
    }
    const newPartner = await db.query(
        'INSERT INTO partners (name, logo_url) VALUES ($1, $2) RETURNING *',
        [name, logo_url]
    );
    res.status(201).json(newPartner.rows[0]);
});

// DELETE a partner
app.delete('/api/partners/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM partners WHERE id = $1', [id]);
    res.status(204).send(); // 204 No Content
});

// UPDATE a partner
app.put('/api/partners/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, logo_url } = req.body;
    if (!name || !logo_url) {
        return res.status(400).json({ error: 'Name and logo URL are required.' });
    }
    const updatedPartner = await db.query(
        'UPDATE partners SET name = $1, logo_url = $2 WHERE id = $3 RETURNING *',
        [name, logo_url, id]
    );
    if (updatedPartner.rows.length === 0) {
        return res.status(404).json({ error: 'Partner not found.' });
    }
    res.json(updatedPartner.rows[0]);
});

// --- PRODUCTS API ---

// GET all products
app.get('/api/products', async (req, res) => {
    const allProducts = await db.query('SELECT * FROM products ORDER BY display_order ASC');
    res.json(allProducts.rows);
});

// POST a new product
app.post('/api/products', authMiddleware, async (req, res) => {
    const { name, description, icon_class, category, category_url, theme, is_featured, display_order } = req.body;
    if (!name || !icon_class) {
        return res.status(400).json({ error: 'Name and Icon Class are required.' });
    }
    const newProduct = await db.query(
        `INSERT INTO products (name, description, icon_class, category, category_url, theme, is_featured, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [name, description, icon_class, category, category_url, theme, is_featured, display_order]
    );
    res.status(201).json(newProduct.rows[0]);
});

// DELETE a product
app.delete('/api/products/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const deleteOp = await db.query('DELETE FROM products WHERE id = $1', [id]);
    if (deleteOp.rowCount === 0) {
        return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(204).send(); // No Content
});

// UPDATE a product
app.put('/api/products/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    const allowedFields = ['name', 'description', 'icon_class', 'category', 'category_url', 'theme', 'display_order', 'is_featured', 'live_url', 'badge_text'];
    const setClauses = [];
    const values = [];
    let valueIndex = 1;
    for (const field of allowedFields) {
        if (fields[field] !== undefined) {
            setClauses.push(`${field} = $${valueIndex++}`);
            values.push(fields[field]);
        }
    }
    if (setClauses.length === 0) {
        return res.status(400).json({ error: 'No fields to update provided.' });
    }
    values.push(id); // Add the id for the WHERE clause
    const updatedProduct = await db.query(
        `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
        values
    );
    res.json(updatedProduct.rows[0]);
});

// --- TESTIMONIALS API ---

// GET all testimonials
app.get('/api/testimonials', async (req, res) => {
    const allTestimonials = await db.query('SELECT * FROM testimonials ORDER BY display_order ASC');
    res.json(allTestimonials.rows);
});

// POST a new testimonial
app.post('/api/testimonials', authMiddleware, async (req, res) => {
    const { quote, client_name, client_title, image_url, display_order } = req.body;
    if (!quote || !client_name) {
        return res.status(400).json({ error: 'Quote and Client Name are required.' });
    }
    const newTestimonial = await db.query(
        `INSERT INTO testimonials (quote, client_name, client_title, image_url, display_order)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [quote, client_name, client_title, image_url, display_order]
    );
    res.status(201).json(newTestimonial.rows[0]);
});

// DELETE a testimonial
app.delete('/api/testimonials/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const deleteOp = await db.query('DELETE FROM testimonials WHERE id = $1', [id]);
    if (deleteOp.rowCount === 0) {
        return res.status(404).json({ error: 'Testimonial not found.' });
    }
    res.status(204).send();
});

// UPDATE a testimonial
app.put('/api/testimonials/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    const allowedFields = ['quote', 'client_name', 'client_title', 'image_url', 'display_order'];
    const setClauses = [];
    const values = [];
    let valueIndex = 1;
    for (const field of allowedFields) {
        if (fields[field] !== undefined) {
            setClauses.push(`${field} = $${valueIndex++}`);
            values.push(fields[field]);
        }
    }
    if (setClauses.length === 0) {
        return res.status(400).json({ error: 'No fields to update provided.' });
    }
    values.push(id);
    const updatedTestimonial = await db.query(`UPDATE testimonials SET ${setClauses.join(', ')} WHERE id = $${valueIndex} RETURNING *`, values);
    res.json(updatedTestimonial.rows[0]);
});

// --- USERS API ---

// GET all users (excluding password hash)
app.get('/api/users', authMiddleware, async (req, res) => {
    const result = await db.query('SELECT id, username, role, created_at FROM users ORDER BY id ASC');
    res.json(result.rows);
});

// POST a new user
app.post('/api/users', authMiddleware, async (req, res) => {
    const { username, password, role = 'admin' } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const newUser = await db.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
        [username, password_hash, role]
    );
    res.status(201).json(newUser.rows[0]);
});

// UPDATE a user (username or password)
app.put('/api/users/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    if (password) {
        // If password is provided, update it
        const password_hash = bcrypt.hashSync(password, 10);
        await db.query('UPDATE users SET username = $1, password_hash = $2 WHERE id = $3', [username, password_hash, id]);
    } else {
        // Otherwise, just update the username
        await db.query('UPDATE users SET username = $1 WHERE id = $2', [username, id]);
    }
    res.status(200).json({ message: 'User updated successfully.' });
});

// DELETE a user
app.delete('/api/users/:id', authMiddleware, async (req, res) => {
    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.status(204).send();
});

// --- VERIFY TOKEN ENDPOINT ---
app.get('/api/verify-token', authMiddleware, (req, res) => {
    // If the authMiddleware passes, the token is valid.
    res.status(200).json({ valid: true, user: req.user });
});

// Centralized Error Handling Middleware
// This should be the LAST app.use() call
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the full error stack
    // Check if the error is from the database driver
    if (err.message.includes('database') || err.code) {
        console.error('Database Error:', err.message);
        return res.status(500).json({ error: 'A database error occurred.' });
    }
    res.status(500).json({ error: 'Server error. Please try again later.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
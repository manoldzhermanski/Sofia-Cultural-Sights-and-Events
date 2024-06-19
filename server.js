const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Add this line

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(cors());

// Serve static files from the "Sofia_Sights" directory
app.use(express.static(path.join(__dirname, 'Sofia_Sights')));
app.use(express.static(path.join(__dirname, 'images')));

app.get('/galleries', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM midzherman_work.galleries');
        res.json({ galleries: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/theatres', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM midzherman_work.theatres');
        res.json({ theatres: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/museums', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM midzherman_work.museums');
        res.json({ museums: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/events', async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }

    try {
        const result = await pool.query(`
            SELECT *
            FROM midzherman_work.events
            WHERE $1::date BETWEEN starting_date::date AND ending_date::date
        `, [date]);

        res.json({ activeEvents: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Sofia_Sights', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

router.get('/', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        // Build query object
        const query = {};

        // Task 2: Check if name exists and is not empty
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name.trim(), $options: 'i' }; // case-insensitive
        }

        // Task 3: Add other filters
        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.condition) {
            query.condition = req.query.condition;
        }

        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        // Task 4: Fetch filtered gifts
        const gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (e) {
        console.error("Error fetching filtered gifts:", e);
        res.status(500).send("Error fetching filtered gifts");
    }
});

module.exports = router;

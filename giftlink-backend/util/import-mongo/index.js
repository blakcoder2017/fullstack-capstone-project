require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load JSON data
const filename = path.join(__dirname, 'gifts.json');
const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;

// MongoDB configuration
const url = process.env.MONGO_URL; // Should already include the DB name in the URI
const collectionName = 'gifts';

async function loadData() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('✅ Connected successfully to MongoDB Atlas');

    // Automatically picks DB from URL if included
    const db = client.db(); 
    const collection = db.collection(collectionName);

    const existingDocs = await collection.find({}).toArray();

    if (existingDocs.length === 0) {
      const result = await collection.insertMany(data);
      console.log(`📦 Inserted ${result.insertedCount} documents into '${collectionName}' collection.`);
    } else {
      console.log(`ℹ️ '${collectionName}' collection already contains data. No new inserts.`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed.');
  }
}

loadData();

module.exports = { loadData };

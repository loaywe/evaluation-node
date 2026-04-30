const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

// Allow a developer-friendly local default when MONGO_URI isn't provided.
const MONGO_URI = process.env.MONGO_URI ;

function connectDB() {
  mongoose.connect(MONGO_URI, { family: 4 })
    .then(() => console.log('MongoDB connected successfully to'))
    .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = connectDB;

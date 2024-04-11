const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/EX-JS`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
      
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = connectDB;

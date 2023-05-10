require('dotenv').config();
const mongoose =require("mongoose");
const mongoURI = process.env.DATABASE_URI;

const connectToDatabase = () => {
    return new Promise((resolve, reject) => {
      mongoose.connect(mongoURI, { useNewUrlParser: true });
      const database = mongoose.connection;
  
      database.on('error', (error) => {
        console.error(error);
        reject(error);
      });
  
      database.once('open', () => {
        console.log('Database connected');
        resolve();
      });
    });
  };

module.exports = connectToDatabase;
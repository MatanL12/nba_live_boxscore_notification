require('dotenv').config();
const mongoose =require("mongoose");
const mongoURI = process.env.DATABASE_URI;

// const connectToDatabase = async () => {
//     await mongoose.connect(mongoURI, {useNewUrlParser: true});
//     const database = await mongoose.connection;
//     database.on('error', (error) => {
//         console.log(error)
//     })
//     database.once('connected', () => {
//         console.log('Database Connected');
//     })
// }

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
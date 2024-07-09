const mysql=require('mysql2')
const env=require('dotenv')
env.config();
const dbDonations = mysql.createConnection({
    host: process.env.DB_HOST, // e.g., 'localhost' or '127.0.0.1' or your remote host
    user: process.env.DB_DONATION_USER,
    password: process.env.DB_DONATION_PASS,
    database: process.env.DB_DONATION_NAME,
    connectTimeout: 10000 // 10 seconds timeout
  });

module.exports={dbDonations}
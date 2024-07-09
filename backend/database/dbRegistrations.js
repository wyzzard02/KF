const mysql=require('mysql2')
const env=require('dotenv')
env.config();
const dbRegistrations = mysql.createConnection({
    host: process.env.DB_HOST, // e.g., 'localhost' or '127.0.0.1' or your remote host
    user: process.env.DB_REGISTRATION_USER,
    password: process.env.DB_REGISTRATION_PASS,
    database: process.env.DB_REGISTRATION_NAME,
    connectTimeout: 10000 // 10 seconds timeout
  });

module.exports={dbRegistrations}
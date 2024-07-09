const mysql=require('mysql2')
const env=require('dotenv')
env.config();
const dbUsers = mysql.createConnection({
    host: process.env.DB_HOST, // e.g., 'localhost' or '127.0.0.1' or your remote host
    user: process.env.DB_USERS_USER,
    password: process.env.DB_USERS_PASS,
    database: process.env.DB_USERS_NAME,
    connectTimeout: 10000 // 10 seconds timeout
  });

module.exports={dbUsers}
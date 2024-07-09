// server.js
const express = require('express');
const sql=require('mysql2')
const app = express();
const {dbUsers} = require('./database/dbUsers');
const {dbDonations} = require('./database/dbDonations');
const {dbRegistrations} = require('./database/dbRegistrations');
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const cors = require('cors')
const cookieParser = require('cookie-parser');

// Establishing database connection

dbUsers.connect((err) => {          // Connection to database containing users
  if (err) {
    console.error('Failed to connect to MySQL Users database:', err);
  } else {
    console.log('Connected to MySQL Users database');
  }
});
dbDonations.connect((err) => {      // Connection to database containing donations
  if (err) {
    console.error('Failed to connect to MySQL Donations database:', err);
  } else {
    console.log('Connected to MySQL Donations database');
  }
});
dbRegistrations.connect((err) => {      // Connection to database containing registrations
  if (err) {
    console.error('Failed to connect to MySQL Registrations database:', err);
  } else {
    console.log('Connected to MySQL Registrations database');
  }
});

// Database connection established

// Express MiddleWare

app.use(cookieParser())              //Parsing JWT Cookie
app.use(cors({                       //CORS
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());              
app.use(express.urlencoded({extended: true}))

// End of Express MiddleWare


// POST 
// ADMIN LOGIN ROUTE

app.post('/adminLogin', async (req,res)=>{
    const {username,password} = req.body;
    dbUsers.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {   // QUERYING TABLE FOR SEARCH OPERATION
      console.log('results = ',results)
      if (err) return res.status(500).json({auth:false, msg: 'Server error'});
      if (results.length === 0) return res.status(401).json({auth:false, msg:'Invalid username or password'});

      const user = results[0];
      const passwordIsValid = bcrypt.compareSync(password, user.password);
  
      if (!passwordIsValid) return res.status(401).json({auth:false, msg:'Invalid username or password'});
  
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 }); // 24 hours
      res.cookie('jwt',token,{
        httpOnly:true,
        secure:false,
        maxAge:1000*60*60*24
      })
      res.status(200).json({auth: true});   
})
})
app.post('/adminLogout',async (req,res)=>{
    res.cookie('jwt','',{
      httpOnly:true,
      expires: new Date(0)
    })
    res.status(200).json({message: "Successfully Logged Out"})
})




// GET
// VALIDATING JSON WEB TOKEN FOR ACCESS TO ADMIN ROUTES

app.get('/authCheck', async (req,res)=>{
    try{
      const token = req.cookies.jwt;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({auth:true})
    }
    catch(e){
      res.status(401).json({auth:false})
    }
  })

// ROUTE FOR RECEIVING ALL DONATION DATA

app.get('/getDonations', (req,res)=>{
  try{
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    dbDonations.query('SELECT * FROM donations', (err,results)=>{   // QUERYING TABLE FOR READ OPERATION
      res.status(200).json(results)
    })
  }
  catch(e){
    res.status(401).json({auth:false})
  }
})
//
// ROUTE FOR RECEIVING ALL REGISTRATION DATA

app.get('/getRegistrations', (req,res)=>{
  try{
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    dbRegistrations.query('SELECT * FROM registrations', (err,results)=>{   // QUERYING TABLE FOR READ OPERATION
      res.status(200).json(results)
    })
  }
  catch(e){
    res.status(401).json({auth:false})
  }
})
//

// EXPRESS LISTENER

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

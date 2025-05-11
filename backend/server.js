const express = require('express');
const cors = require('cors');
const session = require('express-session');
const db = require('./db');

const port=3000;

const app=express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true
}));

app.post('/add-bus', (req, res) => {
  const { bus_name, total_seats, bus_type } = req.body;

  if (!bus_name || !total_seats || !bus_type) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const sql = 'INSERT INTO buses (bus_name, total_seats, bus_type) VALUES (?, ?, ?)';
  db.query(sql, [bus_name, total_seats, bus_type], (err, result) => {
    if (err) {
      console.error('Error adding bus:', err);
      return res.status(500).json({ success: false, message: 'Database insert failed' });
    }
    res.json({ success: true, message: 'Bus added successfully', bus_id: result.insertId });
  });
});

app.listen(port,()=>{
    console.log("Server run on http://localhost:"+port);
    
})
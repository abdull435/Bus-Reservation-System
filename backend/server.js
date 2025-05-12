const express = require('express');
const cors = require('cors');
const session = require('express-session');
const db = require('./db');

const port=3000;

const app=express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
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

app.post('/add-route', (req, res) => {
  const { from_city, to_city } = req.body;

  if (!from_city || !to_city) {
    return res.status(400).json({ success: false, message: 'Both cities are required' });
  }

  const checkSql = 'SELECT * FROM routes WHERE from_city = ? AND to_city = ?';

  db.query(checkSql, [from_city, to_city], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking route:', checkErr);
      return res.status(500).json({ success: false, message: 'Database check failed' });
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ success: false, message: 'Route already exists' });
    }

  
  const sql = 'INSERT INTO routes (from_city, to_city) VALUES (?, ?)';
  
  db.query(sql, [from_city, to_city], (err, result) => {
    if (err) {
      console.error('Error adding route:', err);
      return res.status(500).json({ success: false, message: 'Database insert failed' });
    }
    
    res.json({ success: true, message: 'Route added successfully', route_id: result.insertId });
  });
});
});

app.get('/get-buses', (req, res) => {
  const sql = 'SELECT * FROM buses';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching buses:', err);
      return res.status(500).json({ success: false, message: 'Database query failed' });
    }
    res.json(result);
  });
});

app.get('/get-routes', (req, res) => {
  const sql = 'SELECT * FROM routes';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching routes:', err);
      return res.status(500).json({ success: false, message: 'Database query failed' });
    }
    res.json(result);
  });
});

app.post('/add-schedule', (req, res) => {
  const { bus_id, route_id, departure_time, arrival_time, date } = req.body;

  if (!bus_id || !route_id || !departure_time || !arrival_time || !date) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const sql = 'INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, date) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [bus_id, route_id, departure_time, arrival_time, date], (err, result) => {
    if (err) {
      console.error('Error adding schedule:', err);
      return res.status(500).json({ success: false, message: 'Database insert failed' });
    }
    
    res.json({ success: true, message: 'Schedule added successfully', schedule_id: result.insertId });
  });
});

app.get('/get-cities', (req, res) => {
  db.query('SELECT DISTINCT from_city, to_city FROM routes', (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });
    
    const cities = new Set();
    result.forEach(row => {
      cities.add(row.from_city);
      cities.add(row.to_city);
    });

    res.json({ success: true, cities: Array.from(cities) });
  });
});

app.post('/get-schedules', (req, res) => {
  const { from_city, to_city, travel_date } = req.body;

  const sql = `
    SELECT s.*, r.from_city, r.to_city
    FROM schedules s
    JOIN routes r ON s.route_id = r.route_id
    WHERE r.from_city = ? AND r.to_city = ? AND s.date = ?
  `;

  db.query(sql, [from_city, to_city, travel_date], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, schedules: results });
  });
});

app.post('/get-seats', (req, res) => {
  const { schedule_id } = req.body;

  db.query(
    'SELECT seat_number, gender FROM reservation WHERE schedule_id = ? AND is_reserved = 1',
    [schedule_id],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err });

      res.json({ success: true, reservedSeats: result });
    }
  );
});


app.listen(port,()=>{
    console.log("Server run on http://localhost:"+port);
    
})
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const db = require('./db');
const bcrypt = require('bcrypt');
const saltRounds =10;

const port=3000;

const app=express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set true if using https
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

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(password);
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.json({ success: false, message: 'Email already registered' });
          }
          return res.status(500).json({ success: false, message: 'DB error' });
        }
        res.json({ success: true });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error hashing password' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });

    if (results.length === 0) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const user = results[0];

    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.user = {
        id: user.user_id,
        name: user.name,
        email: user.email
    };
        res.json({ success: true, user: req.session.user });
      } else {
        res.json({ success: false, message: 'Invalid email or password' });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error verifying password' });
    }
  });
});


app.get('/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); // Optional: clear cookie
    res.json({ success: true });
  });
});

app.post('/reserve-seat', (req, res) => {
  const { schedule_id, seat_number, gender } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }

  const user_id = req.session.user.id;

  // Check if seat already reserved
  db.query(
    'SELECT * FROM reservation WHERE schedule_id = ? AND seat_number = ?',
    [schedule_id, seat_number],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'DB error' });
      if (results.length > 0) {
        return res.json({ success: false, message: 'Seat already reserved' });
      }

      // Insert new reservation
      db.query(
        'INSERT INTO reservation (schedule_id, seat_number, is_reserved, gender, user_id) VALUES (?, ?, 1, ?, ?)',
        [schedule_id, seat_number, gender, user_id],
        (err2, result2) => {
          if (err2) return res.status(500).json({ success: false, message: 'DB insert error' });
          res.json({ success: true });
        }
      );
    }
  );
});




app.listen(port,()=>{
    console.log("Server run on http://localhost:"+port);
    
})
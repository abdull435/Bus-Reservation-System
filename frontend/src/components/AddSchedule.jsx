import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSchedule = () => {
  const [busId, setBusId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [date, setDate] = useState('');

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState('');  

  const today = new Date().toISOString().split("T")[0];
  
  useEffect(() => {
    
    axios.get('http://localhost:3000/get-buses')
      .then(response => {
        setBuses(response.data);
      })
      .catch(error => {
        console.error('Error fetching buses:', error);
        setError('Failed to fetch buses');
      });

    axios.get('http://localhost:3000/get-routes')
      .then(response => {
        setRoutes(response.data);
      })
      .catch(error => {
        console.error('Error fetching routes:', error);
        setError('Failed to fetch routes');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  

  const handleSubmit = (e) => {
    e.preventDefault();

    if(departureTime===arrivalTime){
      alert('Departure and arrival both are not same');
      return;
    }
    if(departureTime>arrivalTime){
      alert('Departure time is not greater then arrival');
      return;
    }
    if (!busId || !routeId || !departureTime || !arrivalTime || !date) {
      alert('Please fill out all fields');
      return;
    }

    const scheduleData = {
      bus_id: busId,
      route_id: routeId,
      departure_time: `${date} ${departureTime}`,
      arrival_time: `${date} ${arrivalTime}`,
      date: date
    };

    axios
      .post('http://localhost:3000/add-schedule', scheduleData)
      .then((response) => {
        if (response.data.success) {
          alert('Schedule added successfully');
          setBusId('');
          setRouteId('');
          setDepartureTime('');
          setArrivalTime('');
          setDate('');
        } else {
          alert('Error adding schedule');
        }
      })
      .catch((error) => {
        console.error('Error adding schedule:', error);
        alert('Failed to add schedule');
      });
  };


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 mt-[10vh]">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Add New Schedule</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Bus</label>
            <select
              value={busId}
              onChange={(e) => setBusId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Bus</option>
              {buses.map((bus) => (
                <option key={bus.bus_id} value={bus.bus_id}>
                  {bus.bus_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Route</label>
            <select
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Route</option>
              {routes.map((route) => (
                <option key={route.route_id} value={route.route_id}>
                  {route.from_city} to {route.to_city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Departure Time</label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Arrival Time</label>
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300"
          >
            Add Schedule
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSchedule;

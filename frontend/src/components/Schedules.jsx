import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SeatSelection from './SeatSelection';

const Schedule = ({ from, to, date }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  

  useEffect(() => {
    if (!from || !to || !date) return;

    setLoading(true);
    axios.post('http://localhost:3000/get-schedules', {
      from_city: from,
      to_city: to,
      travel_date: date
    }, { withCredentials: true })
    .then(res => {
      if (res.data.success) {
        setSchedules(res.data.schedules);
      } else {
        setSchedules([]);
      }
    })
    .catch(err => {
      console.error('Error fetching schedules:', err);
      setSchedules([]);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [from, to, date]);

  const handleViewSeats = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
  };

  if (loading) return <p className="text-center mt-4">Loading schedules...</p>;

  return (
    <div className="mt-6">
      {schedules.length === 0 ? (
        <p className="text-center text-gray-600">No schedules found for the selected route and date.</p>
      ) : (
        <div className="space-y-4">
          {schedules.map(schedule => (
            <div key={schedule.schedule_id} className="border p-4 rounded shadow">
              <p><strong>Bus ID:</strong> {schedule.bus_id}</p>
              <p><strong>Departure:</strong> {new Date(schedule.departure_time).toLocaleTimeString()}</p>
              <p><strong>Arrival:</strong> {new Date(schedule.arrival_time).toLocaleTimeString()}</p>
              <p><strong>Date:</strong> {new Date(schedule.date).toLocaleDateString()}</p>
              {/* You can add a button here to view seats */}
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                onClick={() => handleViewSeats(schedule.schedule_id)}
              >View Seats</button>
            </div>
          ))}
        </div>
      )}

      {selectedScheduleId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Seat Selection</h3>
          <SeatSelection scheduleId={selectedScheduleId} />
        </div>
      )}
    </div>
  );
};

export default Schedule;
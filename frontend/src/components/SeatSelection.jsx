import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GenderDialog from './GenderDialog';

const SeatSelection = ({ scheduleId }) => {
  const [seatColors, setSeatColors] = useState(Array(40).fill('bg-gray-300'));
  const [reservedIndexes, setReservedIndexes] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(null);

  useEffect(() => {
    if (scheduleId) {
      axios.post('http://localhost:3000/get-seats', { schedule_id: scheduleId })
        .then(res => {
          if (res.data.success) {
            const newColors = [...seatColors];
            const reserved = [];

            res.data.reservedSeats.forEach(seat => {
              const index = seat.seat_number - 1;
              newColors[index] = seat.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500';
              reserved.push(index);
            });

            setSeatColors(newColors);
            setReservedIndexes(reserved);
          }
        })
        .catch(err => console.error('Error fetching reserved seats:', err));
    }
  }, [scheduleId]);

  const handleSeatClick = (index) => {
    if (reservedIndexes.includes(index)) return; // Block reserved seats
    setSelectedSeatIndex(index);
    setShowDialog(true);
  };

  const handleGender = (gender) => {
    setSeatColors((prev) => {
      const updated = [...prev];
      updated[selectedSeatIndex] = gender === 'male' ? 'bg-blue-500' : 'bg-pink-500';
      return updated;
    });

    // Update reserved list
    setReservedIndexes((prev) => [...prev, selectedSeatIndex]);
    setShowDialog(false);
    setSelectedSeatIndex(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-2 mt-10">
        {seatColors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleSeatClick(index)}
            className={`w-10 h-10 ${color} text-black rounded-lg ${
              reservedIndexes.includes(index) ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            disabled={reservedIndexes.includes(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button className="mt-6 bg-green-500 px-4 py-2 rounded-lg text-white">Reserve Seat</button>

      {showDialog && (
        <GenderDialog
          seatNumber={selectedSeatIndex + 1}
          onSelectGender={handleGender}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default SeatSelection;

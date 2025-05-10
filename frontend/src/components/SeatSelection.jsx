import React, { useState } from 'react';
import GenderDialog from './GenderDialog';

const SeatSelection = () => {

  const [seatColour, setSeatColour] = useState(Array(40).fill('bg-gray-300')); 
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(null);

  const handleSeat = (index) => {
    setSelectedSeatIndex(index);
    setShowDialog(true);
  };

  const handleGender =(gender)=>{
    setSeatColour((prevcolours)=>{
      const newColours=[...prevcolours];
      newColours[selectedSeatIndex]= gender === 'male' ? 'bg-blue-500' : 'bg-pink-500';
      return newColours;
    })

    setShowDialog(false);
    setSelectedSeatIndex(null);

  };

  return (
    <div className='flex flex-col justify-center align-center flex-wrap'>
    <div className="flex  justify-center mt-10">
      <div className="grid grid-cols-4 gap-2 mt-10">

        {seatColour.map((color, index) => (
          
          <button
          onClick={()=>handleSeat(index)}
            value={index}
            className={`w-10 h-10 flex items-center ${color} justify-center  cursor-pointer text-black rounded-lg`}
          >
            {index + 1}
          </button>
        ))}
      </div >

      
        </div>
        <div>
        <button className='bg-green-300 p-3 rounded-lg'>Reserve Seat</button>
      </div>
      {showDialog && (
        <GenderDialog
          seatNumber={selectedSeatIndex}
          onSelectGender={handleGender}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default SeatSelection;
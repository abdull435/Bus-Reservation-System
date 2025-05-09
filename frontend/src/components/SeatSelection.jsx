import React, { useState } from 'react';

const SeatSelection = () => {

  const [seatColour, setSeatColour] = useState(Array(40).fill('bg-gray-300')); // Initial color is gray

  const handleClick = (index) => {
    setSeatColour((prevcolours)=>{
      const newColours=[...prevcolours];
      newColours[index]=newColours[index]==='bg-gray-300'?'bg-blue-300':'bg-gray-300'
      return newColours;
    })
  };

  return (
    <div className='flex flex-col justify-center align-center flex-wrap'>
    <div className="flex  justify-center mt-10">
      <div className="grid grid-cols-4 gap-2 mt-10">

        {seatColour.map((color, index) => (
          
          <button
          onClick={()=>handleClick(index)}
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
    </div>
  );
};

export default SeatSelection;
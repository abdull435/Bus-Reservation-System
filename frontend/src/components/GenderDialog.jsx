import React from 'react';

const GenderDialog = ({ seatNumber, onSelectGender, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg text-center">
        <h2 className="text-lg font-bold mb-4">
          Choose Gender for Seat {seatNumber + 1}
        </h2>
        <div className="flex justify-around">
          <button
            onClick={() => onSelectGender('male')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Male
          </button>
          <button
            onClick={() => onSelectGender('female')}
            className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded"
          >
            Female
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GenderDialog;
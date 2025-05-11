import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md  p-6  mt-[10vh]">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Ready, Steady, Go</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Travel From</label>
          <input
            list="fromOptions"
            name="from"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="fromOptions">
            <option value="Chichawtni" />
            <option value="Islamabad" />
          </datalist>

        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Travel To
          </label>
          <input list="fromOptions" name="to"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="fromOptions">
            <option value="Chichawtni" />
            <option value="Islamabad" />
          </datalist>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Departure Date
          </label>
          <input type="date" id="date" name="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300"
        >FIND YOUR JOURNEY
        </button>
      </form>
    </div>
    </div>
  );
};

export default Home;
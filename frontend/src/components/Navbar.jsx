import { useState } from "react";

export default function Navbar() {

  return (
    <nav className="bg-blue-600 shadow-md fixed top-0 w-full z-10 min-h-[10vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="text-white font-bold text-xl">Bus Online</div>

          <div className=" md:flex space-x-6">
            <a href="#" className="text-white hover:text-yellow-300">Home</a>
            <a href="#" className="text-white hover:text-yellow-300">Terminal</a>
            <a href="#" className="text-white hover:text-yellow-300">Services</a>
            <a href="#" className="text-white hover:text-yellow-300">About Us</a>
          </div>

          <div className="md:block">
            <a href="#"
              className="bg-yellow-400 text-blue-800 font-semibold px-4 py-2 rounded hover:bg-yellow-300"
            >Login</a>
          </div>

          
        </div>
      </div>

      
    </nav>
  );
}

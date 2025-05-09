import './App.css'
import Navbar from './components/Navbar';
import BusSearch from './components/BusSearch';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {   
  return (
    <>
    <Navbar/>
    <BusSearch/>
    </>
  )
}

export default App

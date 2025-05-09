import './App.css'
import Navbar from './components/Navbar';
import BusSearch from './components/BusSearch';
import SeatSelection from './components/SeatSelection';
import GenderDialog from './components/GenderDialog';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {   
  return (
    <>
    <Navbar/>
    <BusSearch/>
    <SeatSelection/>
    </>
  )
}

export default App

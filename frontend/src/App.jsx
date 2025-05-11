import './App.css'
import Navbar from './components/Navbar';
import Home from './components/Home';
import SeatSelection from './components/SeatSelection';
import AddSchedule from './components/AddSchedule';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {   
  return (
    <>
    <Navbar/>
    <Home/>
    <SeatSelection/>
    <AddSchedule/>
    </>
  )
}

export default App

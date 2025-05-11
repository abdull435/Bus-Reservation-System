import './App.css'
import Navbar from './components/Navbar';
import Home from './components/Home';
import SeatSelection from './components/SeatSelection';
import AddSchedule from './components/AddSchedule';
import AdminPanel from './components/AdminPanel';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {   
  return (
    <>
    <Navbar/>
    <Home/>
    <SeatSelection/>
    <AdminPanel/>
    </>
  )
}

export default App

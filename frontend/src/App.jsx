import './App.css'
import Navbar from './components/Navbar';
import Home from './components/Home';
import SeatSelection from './components/SeatSelection';
import AddSchedule from './components/AddSchedule';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';

function App() {   
  return (
    <>
    <Router>
      <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<><Navbar/><Home/></>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
    </>
  )
}

export default App

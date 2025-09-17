import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar'
import Footer from './components/footer';
import Login from './components/Login';
import Payment from './pages/BuyCredit';
import BuyCredit from './pages/BuyCredit';
function App() {
  return (
    <div className="App">
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/buy" element={<BuyCredit />} />
        </Routes>

        <Footer />
      </div>
    </div>
  );
}

export default App;
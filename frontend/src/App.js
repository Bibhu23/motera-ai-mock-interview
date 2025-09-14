import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

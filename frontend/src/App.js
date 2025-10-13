import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar'
import Footer from './components/footer';
import Login from './components/Login';
import BuyCredit from './pages/BuyCredit';
import Features from './pages/Features';
import Round1 from './pages/Round1';
import Round2 from './pages/Round2';
import LiveVideoInterviewPage from './pages/LiveVideoInterviewPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ExamPage from './pages/ExamPage';
import ProfilePage from './pages/ProfilePage'
import HrInterviewPage from './pages/Hrround';
import ProfileViewPage from './pages/Profileviewpage';
import HrResultPage from "./pages/HrResultPage";
function App() {
  return (
    <div className="App">
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/features' element={<Features />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/buy" element={<BuyCredit />} />
          <Route path='/round1' element={<Round1 />} />
          <Route path='/round2' element={<Round2 />} />
          <Route path='/livevideo' element={<LiveVideoInterviewPage />} />
          <Route path='/round2' element={<ExamPage />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/terms' element={<TermsConditions />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/hrround" element={<HrInterviewPage />} />
          <Route path='/profile/view' element={<ProfileViewPage />} />
          <Route path="/hr-result" element={<HrResultPage />} />

        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
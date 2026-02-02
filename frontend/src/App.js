import './App.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Signup from './components/Signup';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
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
import ProfilePage from './pages/ProfilePage';
import HrInterviewPage from './pages/Hrround';
import ProfileViewPage from './pages/Profileviewpage';
import HrResultPage from "./pages/HrResultPage";
import LiveVideoResultPage from './pages/LiveVideoResultPage'
import Settings from './pages/Settings';
import { AppContext } from './context/Appcontext';
import { useContext } from 'react';
import { useEffect } from 'react';
function App() {
  const location = useLocation();
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!login && location.pathname !== "/login" && location.pathname !== "/signup") {
      navigate("/login");
    }
  }, [login, location, navigate]);
  // routes where navbar/footer should be hidden
  const hideLayoutRoutes = ["/login", "/signup"];

  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!hideLayout && <Navbar />}

      <div className={!hideLayout ? "main-content" : "blur-background"}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/buy" element={<BuyCredit />} />
          <Route path="/round1" element={<Round1 />} />
          <Route path="/round2" element={<Round2 />} />
          <Route path="/livevideo" element={<LiveVideoInterviewPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/hrround" element={<HrInterviewPage />} />
          <Route path="/profile/view" element={<ProfileViewPage />} />
          <Route path="/hr-result" element={<HrResultPage />} />
          <Route path='/technical-result' element={<LiveVideoResultPage />} />
          <Route path="/settings" element={<Settings />} />

        </Routes>
      </div>

      {!hideLayout && <Footer />}

    </div>
  );
}

export default App;

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const publicRoutes = ['/', '/connexion', '/inscription'];
    
    if (!token && !publicRoutes.includes(location.pathname)) {
      navigate('/connexion');
    }
    
    if (token && publicRoutes.includes(location.pathname)) {
      navigate('/accueil');
    }
  }, [navigate, location.pathname]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />
        <Route path="/accueil" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
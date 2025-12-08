import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage'; 

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/inscription" element={<RegisterPage />} />       
        <Route path="/connexion" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
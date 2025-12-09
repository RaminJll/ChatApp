// src/pages/RegisterPage.tsx
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { type LoginFormData } from '../types/authType';
import { loginUser } from '../services/authService';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInscriptionClick = () => {
    navigate('/inscription'); 
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      await loginUser(formData);
      setSuccess('Connexion réussie !');
      setFormData({ email: '', password: '' });
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(axiosError.response?.data?.error || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Connexion-container">
      <h2 className="Connexion-title">Connexion</h2>
      
      <form onSubmit={handleSubmit}>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="exemple@email.com"
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="********"
          />
          <small className="form-hint">
            8 caractères min, majuscule, minuscule, chiffre et caractère spécial.
          </small>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn-submit">Connexion</button>
      </form>

      <button type="button" className="btn-inscription" onClick={handleInscriptionClick}>Créer un compte</button>
    </div>
  );
}
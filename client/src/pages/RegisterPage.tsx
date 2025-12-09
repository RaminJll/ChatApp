// src/pages/RegisterPage.tsx
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { type RegisterFormData } from '../types/authType';
import { registerUser } from '../services/authService';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import './RegisterPage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      await registerUser(formData);
      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setFormData({ username: '', email: '', password: '' });
      setTimeout(() => {
        navigate('/connexion')
      }, 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(axiosError.response?.data?.error || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Inscription</h2>
      
      <form onSubmit={handleSubmit}>
        
        {/* Username */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Votre pseudo"
          />
        </div>

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

        <button type="submit" className="btn-submit">S'inscrire</button>
      </form>
    </div>
  );
}
// src/pages/RegisterPage.tsx
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { type RegisterFormData } from '../types/authType';
import { registerUser } from '../services/authService';
import { AxiosError } from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
      setSuccess('Inscription réussie ! Redirection...');
      setFormData({ username: '', email: '', password: '' });
      setTimeout(() => {
        navigate('/connexion')
      }, 2000);
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(axiosError.response?.data?.error || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Inscription</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Votre pseudo"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="exemple@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="********"
            />
            <p className="text-xs text-slate-400 mt-2">
              8 caractères min, majuscule, minuscule, chiffre et caractère spécial.
            </p>
          </div>

          {/* Alertes */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200 flex items-center gap-2">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm border border-emerald-200 flex items-center gap-2">
              {success}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Chargement...' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Déjà un compte ? {' '}
          <Link to="/connexion" className="text-blue-600 font-semibold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
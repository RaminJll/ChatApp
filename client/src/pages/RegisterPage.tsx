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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans">
      <div className="bg-slate-900/90 p-10 rounded-3xl shadow-2xl w-full max-w-xl border border-slate-800">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-slate-50">Inscription</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-base font-semibold text-slate-100 mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-3 text-base border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-900 text-slate-100 placeholder:text-slate-500"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Votre pseudo"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-base font-semibold text-slate-100 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 text-base border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-900 text-slate-100 placeholder:text-slate-500"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="exemple@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-base font-semibold text-slate-100 mb-2">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 text-base border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-900 text-slate-100 placeholder:text-slate-500"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="********"
            />
            <p className="text-sm text-slate-400 mt-2">
              8 caractères min, majuscule, minuscule, chiffre et caractère spécial.
            </p>
          </div>

          {/* Alertes */}
          {error && (
            <div className="bg-red-900/40 text-red-200 px-4 py-3 rounded-2xl text-base border border-red-700 flex items-center gap-2">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-900/40 text-emerald-200 px-4 py-3 rounded-2xl text-base border border-emerald-700 flex items-center gap-2">
              {success}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-2xl transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Chargement...' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-8 text-center text-base text-slate-400">
          Déjà un compte ? {' '}
          <Link to="/connexion" className="text-blue-400 font-semibold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
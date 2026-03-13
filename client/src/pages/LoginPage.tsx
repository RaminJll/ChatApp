// src/pages/LoginPage.tsx
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { type LoginFormData } from '../types/authType';
import { loginUser } from '../services/authService';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

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
      const response = await loginUser(formData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccess('Connexion réussie !');
      setFormData({ email: '', password: '' });
      setTimeout(() => {
        navigate('/accueil')
      }, 1000);
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
          <h2 className="text-4xl font-bold text-slate-50">Connexion</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">

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
          </div>

          {error && (
            <div className="bg-red-900/40 text-red-200 px-4 py-3 rounded-2xl text-base border border-red-700 flex items-center gap-2">
               ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-900/40 text-emerald-200 px-4 py-3 rounded-2xl text-base border border-emerald-700 flex items-center gap-2">
               ✅ {success}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-2xl transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-base">
                <span className="bg-slate-900 px-3 text-slate-400">Ou</span>
            </div>
        </div>

        <button 
          type="button" 
          className="w-full py-4 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 text-lg font-semibold rounded-2xl transition-all"
          onClick={handleInscriptionClick}
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
}
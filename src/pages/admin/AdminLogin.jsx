import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/admin/auth/login`, data);
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data));
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--admin-bg)] flex items-center justify-center p-4 font-sans text-[var(--admin-text)]">
      <div className="max-w-md w-full bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif mb-2">Kerala<span className="text-[var(--admin-primary)]">Guide</span></h1>
          <p className="text-[var(--admin-muted)]">Admin Control Panel</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--admin-muted)]">Email</label>
            <input 
              type="email" 
              {...register('email', { required: 'Email is required' })}
              className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-md px-4 py-2.5 focus:border-[var(--admin-primary)] focus:outline-none transition-colors"
              placeholder="admin@kerala.guide"
            />
            {errors.email && <p className="text-[var(--admin-danger)] text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--admin-muted)]">Password</label>
            <input 
              type="password" 
              {...register('password', { required: 'Password is required' })}
              className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-md px-4 py-2.5 focus:border-[var(--admin-primary)] focus:outline-none transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-[var(--admin-danger)] text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--admin-primary)] hover:bg-[var(--admin-teal)] text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

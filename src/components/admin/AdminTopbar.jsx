import { Bell, Search, User as UserIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminTopbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="h-16 bg-[var(--admin-surface)] border-b border-[var(--admin-border)] flex items-center justify-between px-6 font-sans">
      <div className="flex bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-md px-3 py-1.5 items-center w-64">
        <Search size={18} className="text-[var(--admin-muted)] mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-sm text-white w-full"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-[var(--admin-muted)] hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center space-x-3 border-l border-[var(--admin-border)] pl-4">
          <div className="w-8 h-8 rounded-full bg-[var(--admin-primary)] flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="text-sm">
            <p className="text-white font-medium">{user.name || 'Admin'}</p>
            <p className="text-[var(--admin-muted)] text-xs">{user.role || 'System'}</p>
          </div>
          <button onClick={handleLogout} className="ml-2 text-[var(--admin-muted)] hover:text-[var(--admin-danger)] transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTopbar;

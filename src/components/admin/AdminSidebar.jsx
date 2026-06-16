import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Activity, Users, Star, Settings } from 'lucide-react';

const AdminSidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Places', path: '/admin/places', icon: <MapPin size={20} /> },
    { name: 'Activities', path: '/admin/activities', icon: <Activity size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <Star size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-[var(--admin-surface)] border-r border-[var(--admin-border)] flex flex-col h-full font-sans">
      <div className="h-16 flex items-center px-6 border-b border-[var(--admin-border)]">
        <h1 className="text-xl font-bold font-serif text-[var(--admin-text)]">Kerala<span className="text-[var(--admin-primary)]">Guide</span> Admin</h1>
      </div>
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menu.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[var(--admin-primary)] text-white' 
                  : 'text-[var(--admin-muted)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
              }`}
            >
              {item.icon}
              <span className="ml-3 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--admin-border)] text-sm text-[var(--admin-muted)]">
        &copy; 2026 Kerala Guide
      </div>
    </div>
  );
};

export default AdminSidebar;

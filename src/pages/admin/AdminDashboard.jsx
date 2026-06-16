import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, MapPin, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const COLORS = ['#0F6E56', '#1D9E75', '#C8A84B', '#e05252', '#3b82f6', '#8b5cf6'];

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl p-5 flex items-center justify-between">
    <div>
      <p className="text-[var(--admin-muted)] text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
      {icon}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminApi.get('/admin/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-[var(--admin-muted)]">Loading dashboard...</div>;
  if (!stats) return <div className="p-8 text-center text-[var(--admin-danger)]">Failed to load dashboard</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-serif">Dashboard Overview</h2>
      </div>

      {stats.pendingPlaces > 0 && (
        <div className="bg-[var(--admin-gold)] bg-opacity-10 border border-[var(--admin-gold)] text-[var(--admin-gold)] px-4 py-3 rounded-lg flex items-center">
          <AlertTriangle size={20} className="mr-3" />
          <span>There are <strong>{stats.pendingPlaces}</strong> pending places requiring review.</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Places" 
          value={stats.totalPlaces} 
          icon={<MapPin size={24} className="text-[var(--admin-primary)]" />} 
          colorClass="text-[var(--admin-primary)] bg-[var(--admin-primary)]" 
        />
        <StatCard 
          title="Pending Review" 
          value={stats.pendingPlaces} 
          icon={<AlertTriangle size={24} className="text-[var(--admin-gold)]" />} 
          colorClass="text-[var(--admin-gold)] bg-[var(--admin-gold)]" 
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users size={24} className="text-blue-500" />} 
          colorClass="text-blue-500 bg-blue-500" 
        />
        <StatCard 
          title="Total Activities" 
          value={stats.totalActivities} 
          icon={<Activity size={24} className="text-purple-500" />} 
          colorClass="text-purple-500 bg-purple-500" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl p-5 lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Places by District</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.placesByDistrict}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis dataKey="district" stroke="#6b7280" tick={{fontSize: 12}} />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d27', borderColor: '#2a2d3a' }}
                  itemStyle={{ color: '#e8e8e6' }}
                />
                <Bar dataKey="count" fill="var(--admin-teal)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl p-5">
          <h3 className="text-lg font-medium mb-4">Places by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.placesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="category"
                >
                  {stats.placesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d27', borderColor: '#2a2d3a' }}
                  itemStyle={{ color: '#e8e8e6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl p-5 overflow-x-auto">
          <h3 className="text-lg font-medium mb-4 flex justify-between">
            <span>Recent Submissions</span>
          </h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[var(--admin-muted)] border-b border-[var(--admin-border)] text-sm">
                <th className="pb-3 px-2 font-medium">Name</th>
                <th className="pb-3 px-2 font-medium">District</th>
                <th className="pb-3 px-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSubmissions.map(place => (
                <tr key={place._id} className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 px-2">{place.name}</td>
                  <td className="py-3 px-2 text-[var(--admin-muted)] text-sm">{place.district}</td>
                  <td className="py-3 px-2">
                    {place.status === 'pending' ? <span className="text-[var(--admin-gold)] text-xs flex items-center"><AlertTriangle size={12} className="mr-1"/> Pending</span> : 
                     place.status === 'approved' ? <span className="text-[var(--admin-primary)] text-xs flex items-center"><CheckCircle size={12} className="mr-1"/> Approved</span> : 
                     <span className="text-[var(--admin-danger)] text-xs flex items-center"><XCircle size={12} className="mr-1"/> Rejected</span>}
                  </td>
                </tr>
              ))}
              {stats.recentSubmissions.length === 0 && (
                <tr><td colSpan="3" className="py-4 text-center text-[var(--admin-muted)]">No recent submissions</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl p-5 overflow-x-auto">
          <h3 className="text-lg font-medium mb-4">Newest Users</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[var(--admin-muted)] border-b border-[var(--admin-border)] text-sm">
                <th className="pb-3 px-2 font-medium">Name</th>
                <th className="pb-3 px-2 font-medium">Email</th>
                <th className="pb-3 px-2 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map(u => (
                <tr key={u._id} className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 px-2">{u.name}</td>
                  <td className="py-3 px-2 text-[var(--admin-muted)] text-sm">{u.email}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-500 bg-opacity-20 text-purple-400' : 'bg-blue-500 bg-opacity-20 text-blue-400'}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

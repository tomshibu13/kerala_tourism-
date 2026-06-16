import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    if(window.confirm(`Change role to ${newRole}?`)) {
      try {
        await adminApi.patch(`/admin/users/${id}/role`, { role: newRole });
        toast.success(`Role updated to ${newRole}`);
        fetchUsers();
      } catch (error) {
        toast.error('Failed to update role');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-serif">Users Management</h2>
      <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--admin-muted)]">Loading users...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[rgba(255,255,255,0.05)] text-[var(--admin-muted)] text-sm border-b border-[var(--admin-border)]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-[var(--admin-border)] hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 px-4 font-medium">{u.name}</td>
                  <td className="py-3 px-4 text-[var(--admin-muted)]">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-500 bg-opacity-20 text-purple-400' : 'bg-blue-500 bg-opacity-20 text-blue-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {u.isActive ? <span className="text-[var(--admin-primary)]">Active</span> : <span className="text-[var(--admin-danger)]">Inactive</span>}
                  </td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <button onClick={() => handleRoleChange(u._id, u.role)} className="text-blue-400 hover:text-blue-300 text-sm">Toggle Role</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default AdminUsers;

import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get('/admin/activities');
      setActivities(data);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleToggle = async (id) => {
    try {
      await adminApi.patch(`/admin/activities/${id}/toggle`);
      toast.success('Activity status updated');
      fetchActivities();
    } catch (error) {
      toast.error('Toggle failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this activity?")) {
      try {
        await adminApi.delete(`/admin/activities/${id}`);
        toast.success('Activity deleted');
        fetchActivities();
      } catch (error) {
        toast.error('Deletion failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-serif">Activities</h2>
        <button className="bg-[var(--admin-primary)] hover:bg-[var(--admin-teal)] px-4 py-2 rounded-md font-medium">
          + Add Activity
        </button>
      </div>

      <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--admin-muted)]">Loading activities...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[rgba(255,255,255,0.05)] text-[var(--admin-muted)] text-sm border-b border-[var(--admin-border)]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a._id} className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 px-4 font-medium">{a.name}</td>
                  <td className="py-3 px-4 text-[var(--admin-muted)]">{a.district}</td>
                  <td className="py-3 px-4 capitalize text-sm">{a.category}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleToggle(a._id)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${a.isActive ? 'bg-[var(--admin-primary)]' : 'bg-gray-600'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${a.isActive ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                    <button onClick={() => handleDelete(a._id)} className="text-[var(--admin-danger)] hover:text-red-400 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr><td colSpan="5" className="py-8 text-center text-[var(--admin-muted)]">No activities found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminActivities;

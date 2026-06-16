import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { useSearchParams } from 'react-router-dom';
import { Check, X, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'all'; // 'all' or 'pending'

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const url = tab === 'pending' ? '/admin/places/pending' : '/admin/places';
      const { data } = await adminApi.get(url);
      setPlaces(data);
    } catch (error) {
      toast.error('Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [tab]);

  const handleApprove = async (id) => {
    try {
      await adminApi.patch(`/admin/places/${id}/approve`);
      toast.success('Place approved successfully');
      fetchPlaces();
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason === null) return;
    try {
      await adminApi.patch(`/admin/places/${id}/reject`, { rejectionReason: reason });
      toast.success('Place rejected');
      fetchPlaces();
    } catch (error) {
      toast.error('Rejection failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        await adminApi.delete(`/admin/places/${id}`);
        toast.success('Place deleted');
        fetchPlaces();
      } catch (error) {
        toast.error('Deletion failed');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold font-serif">{tab === 'pending' ? 'Pending Places' : 'All Places'}</h2>
        <button className="bg-[var(--admin-primary)] hover:bg-[var(--admin-teal)] px-4 py-2 rounded-md font-medium transition-colors">
          + Add New Place
        </button>
      </div>

      <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[var(--admin-border)] flex flex-col md:flex-row gap-4 justify-between bg-[rgba(255,255,255,0.02)]">
          <div className="flex bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-md px-3 py-2 items-center w-full md:w-80">
            <Search size={18} className="text-[var(--admin-muted)] mr-2" />
            <input 
              type="text" 
              placeholder="Search places..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center text-sm px-3 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-md text-[var(--admin-text)] hover:border-[var(--admin-primary)] transition-colors">
              <Filter size={16} className="mr-2"/> Filter District
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-[var(--admin-muted)]">Loading data...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[rgba(255,255,255,0.05)] text-[var(--admin-muted)] text-sm border-b border-[var(--admin-border)]">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">District</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Author</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {places.map((place) => (
                  <tr key={place._id} className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-3 px-4 font-medium">{place.name}</td>
                    <td className="py-3 px-4 text-[var(--admin-muted)]">{place.district}</td>
                    <td className="py-3 px-4 text-sm capitalize">{place.category}</td>
                    <td className="py-3 px-4">
                      {place.status === 'pending' && <span className="px-2 py-1 bg-kerala-gold/20 text-kerala-gold rounded-full text-xs">Pending</span>}
                      {place.status === 'approved' && <span className="px-2 py-1 bg-kerala-green/20 text-kerala-green rounded-full text-xs">Approved</span>}
                      {place.status === 'rejected' && <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-xs">Rejected</span>}
                    </td>
                    <td className="py-3 px-4 text-sm text-[var(--admin-muted)]">{place.submittedBy?.name || 'Admin'}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {place.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(place._id)} className="p-1 rounded bg-kerala-green/20 text-kerala-green hover:bg-kerala-green/40" title="Approve">
                            <Check size={16} />
                          </button>
                          <button onClick={() => handleReject(place._id)} className="p-1 rounded bg-red-500/20 text-red-500 hover:bg-red-500/40" title="Reject">
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button className="text-blue-400 hover:text-blue-300 text-sm px-2">Edit</button>
                      <button onClick={() => handleDelete(place._id)} className="text-[var(--admin-danger)] hover:text-red-400 text-sm px-2">Delete</button>
                    </td>
                  </tr>
                ))}
                {places.length === 0 && (
                  <tr><td colSpan="6" className="py-8 text-center text-[var(--admin-muted)]">No places found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPlaces;

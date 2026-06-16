import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get('/admin/reviews');
      setReviews(data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this review?")) {
      try {
        await adminApi.delete(`/admin/reviews/${id}`);
        toast.success('Review deleted');
        fetchReviews();
      } catch (error) {
        toast.error('Deletion failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-serif">Reviews Management</h2>
      <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl overflow-hidden p-6 grid gap-4">
        {loading ? <div className="text-center text-[var(--admin-muted)]">Loading reviews...</div> : null}
        
        {!loading && reviews.map((r) => (
          <div key={r._id} className="border border-[var(--admin-border)] p-4 rounded-lg bg-[rgba(255,255,255,0.02)] flex justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium">{r.user?.name || 'Anonymous'}</span>
                <span className="text-[var(--admin-gold)] text-sm">★ {r.rating}</span>
                <span className="text-[var(--admin-muted)] text-sm">on {r.place?.name}</span>
              </div>
              <p className="text-[var(--admin-muted)] text-sm">{r.comment}</p>
            </div>
            <div>
              <button onClick={() => handleDelete(r._id)} className="text-[var(--admin-danger)] text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {!loading && reviews.length === 0 && <div className="text-[var(--admin-muted)]">No reviews found.</div>}
      </div>
    </div>
  );
};
export default AdminReviews;

import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import axios from 'axios';

const ApprovalsPanel = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      setError('');
      try {
        const token = authService.getToken();
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/pending-sell-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPending(res.data);
      } catch {
        setError('Failed to load pending requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleAction = async (id, status) => {
    setActionLoading(id + status);
    try {
      const token = authService.getToken();
      await axios.patch(`http://localhost:5000/api/admin/sell-request/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPending(pending.filter(l => l._id !== id));
    } catch {
      alert('Failed to update status.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="text-slate-400">Loading pending requests...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!pending.length) return <div className="text-slate-400">No pending requests.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-800 border border-slate-700 rounded-xl mt-8">
      <h2 className="text-xl font-bold mb-4 text-slate-100">Pending Sell Requests</h2>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-slate-400">
            <th>Project</th>
            <th>Seller</th>
            <th>Credits</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pending.map(l => (
            <tr key={l._id} className="border-b border-slate-700">
              <td className="py-2 text-slate-200">{l.projectType || 'Project'}</td>
              <td className="py-2">{l.developerId?.companyName || 'Unknown'}</td>
              <td className="py-2">{l.credits}</td>
              <td className="py-2">₹{l.pricePerCredit}</td>
              <td className="py-2 flex gap-2">
                <button
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded"
                  disabled={actionLoading === l._id + 'APPROVED'}
                  onClick={() => handleAction(l._id, 'APPROVED')}
                >
                  {actionLoading === l._id + 'APPROVED' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                  disabled={actionLoading === l._id + 'REJECTED'}
                  onClick={() => handleAction(l._id, 'REJECTED')}
                >
                  {actionLoading === l._id + 'REJECTED' ? 'Rejecting...' : 'Reject'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalsPanel;

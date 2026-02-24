import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  MessageCircle, 
  Star,
  Clock,
  User,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Modal } from '../components/Modal';

export const AdminResponses: React.FC = () => {
  const [responses, setResponses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Feedback form state
  const [feedbackData, setFeedbackData] = useState({
    feedback: '',
    description: '',
    mark: 5
  });

  const fetchResponses = async () => {
    const res = await fetch('/api/admin/responses');
    setResponses(await res.json());
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: selectedResponse.task_id,
          user_id: selectedResponse.user_id,
          ...feedbackData
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFeedbackData({ feedback: '', description: '', mark: 5 });
        alert('Feedback submitted successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-600';
      case 'On Progress': return 'bg-blue-100 text-blue-600';
      case 'Started': return 'bg-amber-100 text-amber-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Task Responses</h1>
        <p className="text-gray-500 mt-1">Review work submitted by employees and provide feedback.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Task Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted At</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {responses.map((resp) => (
                <tr key={resp.response_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#e75480]/10 rounded-full flex items-center justify-center text-[#e75480]">
                        <User size={16} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{resp.user_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{resp.task_name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(resp.task_status)}`}>
                      {resp.task_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {resp.created_at}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {resp.document ? (
                      <a 
                        href={`/static/uploads/${resp.document}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#e75480] hover:underline text-sm font-bold"
                      >
                        <Download size={14} /> Download
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No document</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setSelectedResponse(resp); setIsModalOpen(true); }}
                      className="flex items-center gap-2 bg-[#e75480] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-[#d6436e] transition-all"
                    >
                      <Star size={14} /> Give Feedback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {responses.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4 text-gray-300">
              <FileText size={32} />
            </div>
            <p className="text-gray-500 font-medium">No task responses found yet.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Feedback"
      >
        {selectedResponse && (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase">Employee's Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedResponse.description}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Feedback Type</label>
              <input
                required
                placeholder="e.g. Excellent Work, Needs Improvement"
                value={feedbackData.feedback}
                onChange={(e) => setFeedbackData({...feedbackData, feedback: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Detailed Comments</label>
              <textarea
                required
                rows={4}
                placeholder="Provide constructive feedback..."
                value={feedbackData.description}
                onChange={(e) => setFeedbackData({...feedbackData, description: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Performance Score (1-10)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={feedbackData.mark}
                  onChange={(e) => setFeedbackData({...feedbackData, mark: parseInt(e.target.value)})}
                  className="flex-1 accent-[#e75480]"
                />
                <span className="w-10 h-10 bg-[#e75480] text-white rounded-full flex items-center justify-center font-bold">
                  {feedbackData.mark}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e75480] text-white p-4 rounded-xl font-bold shadow-lg hover:bg-[#d6436e] transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

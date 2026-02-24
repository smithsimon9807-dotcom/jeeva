import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Clock, 
  AlertCircle,
  Send,
  FileText,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Modal } from '../components/Modal';

export const EmployeeTasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Response form state
  const [formData, setFormData] = useState({
    task_status: 'Started',
    description: ''
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    if (userData.id) {
      fetch(`/api/employee/tasks/${userData.id}`)
        .then(r => r.json())
        .then(setTasks);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('task_id', selectedTask.task_id.toString());
    data.append('user_id', user.id.toString());
    data.append('task_status', formData.task_status);
    data.append('description', formData.description);
    if (file) data.append('document', file);

    try {
      const res = await fetch('/api/employee/responses', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ task_status: 'Started', description: '' });
        setFile(null);
        alert('Response submitted successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-amber-100 text-amber-600';
      case 'Low': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Assigned Tasks</h1>
        <p className="text-gray-500 mt-1">Review your tasks and submit your progress updates.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <motion.div
            layout
            key={task.task_id}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
                </span>
                <h3 className="text-2xl font-bold text-gray-900">{task.task_name}</h3>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                <ClipboardList size={24} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{task.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
                  <Clock size={16} className="text-amber-500" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Assigned</p>
                    <p className="text-xs font-bold text-gray-700">{task.assigned_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
                  <AlertCircle size={16} className="text-red-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Deadline</p>
                    <p className="text-xs font-bold text-gray-700">{task.due_date}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Requirements</p>
                <p className="text-sm text-gray-500 italic">{task.specification}</p>
              </div>
            </div>

            <button
              onClick={() => { setSelectedTask(task); setIsModalOpen(true); }}
              className="w-full flex items-center justify-center gap-2 bg-[#e75480] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#d6436e] active:scale-[0.98] transition-all"
            >
              <Send size={18} />
              Submit Response
            </button>
          </motion.div>
        ))}

        {tasks.length === 0 && (
          <div className="col-span-full bg-white p-16 rounded-3xl border border-dashed border-gray-200 text-center">
            <CheckCircle2 className="mx-auto text-emerald-100 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900">All Caught Up!</h3>
            <p className="text-gray-400 mt-2">You don't have any assigned tasks at the moment.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Task Response"
      >
        {selectedTask && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Task Name</label>
              <input
                readOnly
                value={selectedTask.task_name}
                className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 font-medium outline-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Current Status</label>
              <select
                required
                value={formData.task_status}
                onChange={(e) => setFormData({...formData, task_status: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#e75480] outline-none font-medium"
              >
                <option>Seen</option>
                <option>Started</option>
                <option>On Progress</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Work Description</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your progress or completion details..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#e75480] outline-none resize-none font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Attach Document (Optional)</label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#e75480] hover:bg-[#e75480]/5 transition-all cursor-pointer"
                >
                  <Upload className="text-gray-300 group-hover:text-[#e75480] mb-2" size={32} />
                  <span className="text-sm font-bold text-gray-400 group-hover:text-[#e75480]">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-xs text-gray-300 mt-1">PDF, DOCX, JPG or PNG (Max 10MB)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e75480] text-white p-4 rounded-2xl font-bold shadow-lg hover:bg-[#d6436e] transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Send Response'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

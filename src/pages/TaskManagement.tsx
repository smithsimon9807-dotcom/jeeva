import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Edit3, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { Modal } from '../components/Modal';

export const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    emp_id: '',
    task_name: '',
    description: '',
    specification: '',
    priority: 'Medium',
    assigned_date: '',
    due_date: ''
  });

  const fetchData = async () => {
    const [tasksRes, empsRes] = await Promise.all([
      fetch('/api/admin/tasks'),
      fetch('/api/admin/employees')
    ]);
    setTasks(await tasksRes.json());
    setEmployees(await empsRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editingTask ? `/api/admin/tasks/${editingTask.task_id}` : '/api/admin/tasks';
    const method = editingTask ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingTask(null);
        setFormData({
          emp_id: '', task_name: '', description: '', 
          specification: '', priority: 'Medium', assigned_date: '', due_date: ''
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await fetch(`/api/admin/tasks/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const openEditModal = (task: any) => {
    setEditingTask(task);
    setFormData({
      emp_id: task.emp_id.toString(),
      task_name: task.task_name,
      description: task.description,
      specification: task.specification,
      priority: task.priority,
      assigned_date: task.assigned_date,
      due_date: task.due_date
    });
    setIsModalOpen(true);
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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-500 mt-1">Assign and track tasks across your team.</p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-[#e75480] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#d6436e] transition-all"
        >
          <PlusCircle size={20} />
          Assign New Task
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <motion.div
            layout
            key={task.task_id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
                </span>
                <h3 className="text-xl font-bold text-gray-900">{task.task_name}</h3>
                <p className="text-sm text-gray-500 font-medium">Assigned to: <span className="text-[#e75480]">{task.emp_name}</span> ({task.department})</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(task)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleDelete(task.task_id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={14} className="text-gray-400" />
                  <span>Assigned: {task.assigned_date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={14} className="text-gray-400" />
                  <span>Due: {task.due_date}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                <AlertCircle size={14} />
                Requirements: {task.specification.substring(0, 30)}...
              </div>
              <a href="/admin/responses" className="text-xs font-bold text-[#e75480] hover:underline">View Responses →</a>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Assign New Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingTask && (
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Select Employee</label>
              <select
                required
                value={formData.emp_id}
                onChange={(e) => setFormData({...formData, emp_id: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              >
                <option value="">Choose an employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.emp_name} ({emp.department})</option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Task Name</label>
            <input
              required
              value={formData.task_name}
              onChange={(e) => setFormData({...formData, task_name: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none resize-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Specification</label>
            <textarea
              required
              rows={2}
              value={formData.specification}
              onChange={(e) => setFormData({...formData, specification: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Assigned Date</label>
              <input
                required
                type="date"
                value={formData.assigned_date}
                onChange={(e) => setFormData({...formData, assigned_date: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Due Date</label>
            <input
              required
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({...formData, due_date: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e75480] text-white p-4 rounded-xl font-bold shadow-lg hover:bg-[#d6436e] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : (editingTask ? 'Update Task' : 'Assign Task')}
          </button>
        </form>
      </Modal>
    </div>
  );
};

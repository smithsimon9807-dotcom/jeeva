import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Mail, 
  Briefcase, 
  Calendar, 
  Trash2, 
  Edit3, 
  Search,
  Camera
} from 'lucide-react';
import { motion } from 'motion/react';
import { Modal } from '../components/Modal';

export const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    emp_name: '',
    email: '',
    password: '',
    dob: '',
    department: '',
    role: '',
    doj: '',
    status: 'Active',
    gender: 'Male'
  });
  const [file, setFile] = useState<File | null>(null);

  const fetchEmployees = async () => {
    const res = await fetch('/api/admin/employees');
    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value as string));
    if (file) data.append('proof', file);

    const url = editingEmp ? `/api/admin/employees/${editingEmp.id}` : '/api/admin/employees';
    const method = editingEmp ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingEmp(null);
        setFormData({
          emp_name: '', email: '', password: '', dob: '', 
          department: '', role: '', doj: '', status: 'Active', gender: 'Male'
        });
        setFile(null);
        fetchEmployees();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      await fetch(`/api/admin/employees/${id}`, { method: 'DELETE' });
      fetchEmployees();
    }
  };

  const openEditModal = (emp: any) => {
    setEditingEmp(emp);
    setFormData({
      emp_name: emp.emp_name,
      email: emp.email,
      password: emp.password,
      dob: emp.dob,
      department: emp.department,
      role: emp.role,
      doj: emp.doj,
      status: emp.status,
      gender: emp.gender
    });
    setIsModalOpen(true);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.emp_name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-500 mt-1">Manage your team members and their profiles.</p>
        </div>
        <button
          onClick={() => { setEditingEmp(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-[#e75480] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#d6436e] transition-all"
        >
          <UserPlus size={20} />
          Add New Employee
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#e75480] outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredEmployees.map((emp) => (
          <motion.div
            layout
            key={emp.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow"
          >
            <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
              {emp.proof ? (
                <img 
                  src={`/static/uploads/${emp.proof}`} 
                  alt={emp.emp_name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Camera size={32} />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{emp.emp_name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  emp.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}>
                  {emp.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  {emp.email}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-gray-400" />
                  {emp.role} ({emp.department})
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  Joined: {emp.doj}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => openEditModal(emp)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmp ? 'Edit Employee' : 'Add New Employee'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input
                required
                value={formData.emp_name}
                onChange={(e) => setFormData({...formData, emp_name: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">DOB</label>
              <input
                required
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Department</label>
              <input
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Role</label>
              <input
                required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Joining Date</label>
              <input
                required
                type="date"
                value={formData.doj}
                onChange={(e) => setFormData({...formData, doj: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Profile Picture</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e75480]/10 file:text-[#e75480] hover:file:bg-[#e75480]/20"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e75480] text-white p-4 rounded-xl font-bold shadow-lg hover:bg-[#d6436e] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : (editingEmp ? 'Update Employee' : 'Add Employee')}
          </button>
        </form>
      </Modal>
    </div>
  );
};

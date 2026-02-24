import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  UserPlus,
  PlusCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    employees: 0,
    tasks: 0,
    responses: 0,
    feedback: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [emps, tasks, resps, feedback] = await Promise.all([
          fetch('/api/admin/employees').then(r => r.json()),
          fetch('/api/admin/tasks').then(r => r.json()),
          fetch('/api/admin/responses').then(r => r.json()),
          fetch('/api/admin/feedback').then(r => r.json())
        ]);
        setStats({
          employees: emps.length,
          tasks: tasks.length,
          responses: resps.length,
          feedback: feedback.length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Employees', value: stats.employees, icon: Users, color: 'bg-blue-500' },
    { label: 'Assigned Tasks', value: stats.tasks, icon: ClipboardList, color: 'bg-indigo-500' },
    { label: 'Recent Responses', value: stats.responses, icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Total Feedback', value: stats.feedback, icon: Clock, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Administrator. Here's what's happening today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <TrendingUp className="text-emerald-500" size={20} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/employees" className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-100 hover:border-[#e75480] hover:bg-[#e75480]/5 transition-all group">
              <UserPlus className="text-gray-400 group-hover:text-[#e75480] mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-600 group-hover:text-[#e75480]">Add Employee</span>
            </a>
            <a href="/admin/tasks" className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-100 hover:border-[#e75480] hover:bg-[#e75480]/5 transition-all group">
              <PlusCircle className="text-gray-400 group-hover:text-[#e75480] mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-600 group-hover:text-[#e75480]">Assign Task</span>
            </a>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-gray-600">Database Status</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-full uppercase">Connected</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-gray-600">Storage Usage</span>
              <span className="text-sm font-bold text-gray-900">12% used</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-gray-600">Active Sessions</span>
              <span className="text-sm font-bold text-gray-900">4 Employees Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

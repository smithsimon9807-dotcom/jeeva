import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Award,
  ArrowRight,
  LayoutDashboard,
  Bell
} from 'lucide-react';
import { motion } from 'motion/react';

export const EmployeeDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    tasks: 0,
    completed: 0,
    feedback: 0
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    const fetchStats = async () => {
      if (!userData.id) return;
      try {
        const [tasks, responses, feedback] = await Promise.all([
          fetch(`/api/employee/tasks/${userData.id}`).then(r => r.json()),
          fetch(`/api/employee/responses/${userData.id}`).then(r => r.json()),
          fetch(`/api/employee/feedback/${userData.id}`).then(r => r.json())
        ]);
        setStats({
          tasks: tasks.length,
          completed: responses.filter((r: any) => r.task_status === 'Completed').length,
          feedback: feedback.length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hello, {user.name}!</h1>
          <p className="text-gray-500 mt-1">Here's an overview of your current tasks and performance.</p>
        </div>
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#e75480] transition-colors cursor-pointer">
          <Bell size={24} />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Assigned Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tasks}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Feedback Received</p>
              <p className="text-2xl font-bold text-gray-900">{stats.feedback}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Navigation</h2>
          <div className="space-y-3">
            <a href="/employee/tasks" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-[#e75480]/5 group transition-all">
              <div className="flex items-center gap-3">
                <ClipboardList className="text-gray-400 group-hover:text-[#e75480]" size={20} />
                <span className="font-semibold text-gray-700 group-hover:text-[#e75480]">View My Tasks</span>
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-[#e75480] group-hover:translate-x-1 transition-all" size={18} />
            </a>
            <a href="/employee/responses" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-[#e75480]/5 group transition-all">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-gray-400 group-hover:text-[#e75480]" size={20} />
                <span className="font-semibold text-gray-700 group-hover:text-[#e75480]">My Submissions</span>
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-[#e75480] group-hover:translate-x-1 transition-all" size={18} />
            </a>
            <a href="/employee/feedback" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-[#e75480]/5 group transition-all">
              <div className="flex items-center gap-3">
                <Star className="text-gray-400 group-hover:text-[#e75480]" size={20} />
                <span className="font-semibold text-gray-700 group-hover:text-[#e75480]">Performance Feedback</span>
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-[#e75480] group-hover:translate-x-1 transition-all" size={18} />
            </a>
          </div>
        </div>

        <div className="bg-[#e75480] p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Work Smart, Grow Fast</h2>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Consistency is the key to success. Keep track of your deadlines and always aim for high-quality submissions.
            </p>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/60">Next Deadline</p>
                <p className="text-lg font-bold">Check your tasks list</p>
              </div>
            </div>
          </div>
          <LayoutDashboard className="absolute -right-8 -bottom-8 text-white/10" size={200} />
        </div>
      </div>
    </div>
  );
};

const Star = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

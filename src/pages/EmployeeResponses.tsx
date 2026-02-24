import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download,
  Search,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';

export const EmployeeResponses: React.FC = () => {
  const [responses, setResponses] = useState<any[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      fetch(`/api/employee/responses/${user.id}`)
        .then(r => r.json())
        .then(setResponses);
    }
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
        <p className="text-gray-500 mt-1">History of all task responses you've submitted.</p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Task Name</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Submission Date</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Document</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {responses.map((resp, idx) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={resp.response_id}
                  className="hover:bg-gray-50/30 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="font-bold text-gray-900">{resp.task_name}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(resp.task_status)}`}>
                      {resp.task_status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-300" />
                      {resp.created_at}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {resp.document ? (
                      <a 
                        href={`/static/uploads/${resp.document}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#e75480] hover:bg-[#e75480]/10 px-3 py-1.5 rounded-lg transition-all text-xs font-bold"
                      >
                        <Download size={14} /> Download
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300 italic">No attachment</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px] italic">
                      {resp.description}
                    </p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {responses.length === 0 && (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6 text-gray-200">
              <FileText size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Submissions Yet</h3>
            <p className="text-gray-400 mt-2">When you submit task responses, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

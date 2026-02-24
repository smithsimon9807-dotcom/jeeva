import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Search, 
  Calendar, 
  User,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminAnalysis: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    emp_id: '',
    period: '',
    type: 'month' as 'month' | 'year'
  });

  useEffect(() => {
    fetch('/api/admin/employees').then(r => r.json()).then(setEmployees);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filters.emp_id || !filters.period) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/admin/analysis?${params}`);
      setResults(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold uppercase">Completed</span>;
      case 'On Progress': return <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase">In Progress</span>;
      case 'Started': return <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-bold uppercase">Started</span>;
      case 'Seen': return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase">Seen</span>;
      default: return <span className="px-2 py-1 bg-red-50 text-red-400 rounded-full text-[10px] font-bold uppercase">No Response</span>;
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Performance Analysis</h1>
        <p className="text-gray-500 mt-1">Analyze employee task completion and efficiency over time.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Employee</label>
            <select
              required
              value={filters.emp_id}
              onChange={(e) => setFilters({...filters, emp_id: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
            >
              <option value="">Select Employee...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.emp_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Analysis Type</label>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button
                type="button"
                onClick={() => setFilters({...filters, type: 'month'})}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filters.type === 'month' ? 'bg-white shadow-sm text-[#e75480]' : 'text-gray-400'}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setFilters({...filters, type: 'year'})}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filters.type === 'year' ? 'bg-white shadow-sm text-[#e75480]' : 'text-gray-400'}`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">
              {filters.type === 'month' ? 'Select Month' : 'Select Year'}
            </label>
            <input
              required
              type={filters.type === 'month' ? 'month' : 'number'}
              min={filters.type === 'year' ? '2020' : undefined}
              max={filters.type === 'year' ? '2030' : undefined}
              placeholder={filters.type === 'year' ? 'e.g. 2024' : ''}
              value={filters.period}
              onChange={(e) => setFilters({...filters, period: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#e75480] text-white p-3.5 rounded-xl font-bold shadow-lg hover:bg-[#d6436e] transition-all flex items-center justify-center gap-2"
          >
            <Search size={18} />
            {loading ? 'Analyzing...' : 'Generate Report'}
          </button>
        </form>
      </div>

      {results.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Analysis Results</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                Completed: {results.filter(r => r.task_status === 'Completed').length}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                Pending: {results.filter(r => !r.task_status || r.task_status !== 'Completed').length}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map((res) => (
                  <tr key={res.task_id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{res.task_name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">{res.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{res.assigned_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{res.due_date}</td>
                    <td className="px-6 py-4">{getStatusBadge(res.task_status)}</td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-500 italic max-w-[200px] line-clamp-2">
                        {res.response_description || 'No response details provided.'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        !loading && filters.period && (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
            <BarChart3 className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-medium">No data found for the selected period.</p>
          </div>
        )
      )}
    </div>
  );
};

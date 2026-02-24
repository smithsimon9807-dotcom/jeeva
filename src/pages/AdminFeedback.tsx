import React, { useState, useEffect } from 'react';
import { 
  Star, 
  User, 
  Clipboard, 
  Calendar, 
  Award,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminFeedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const res = await fetch('/api/admin/feedback');
      setFeedbackList(await res.json());
    };
    fetchFeedback();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Performance Feedback</h1>
        <p className="text-gray-500 mt-1">History of all feedback given to employees.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {feedbackList.map((f, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={f.feedback_id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6"
          >
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 bg-[#e75480]/5 rounded-2xl border border-[#e75480]/10">
              <Award className="text-[#e75480] mb-1" size={32} />
              <span className="text-2xl font-bold text-[#e75480]">{f.mark}/10</span>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{f.feedback}</h3>
                  <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-gray-400" />
                      <span className="font-semibold text-gray-700">{f.emp_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clipboard size={14} className="text-gray-400" />
                      <span>Task: {f.task_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{f.created_at}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex gap-3">
                  <MessageSquare size={18} className="text-gray-400 flex-shrink-0 mt-1" />
                  <p className="text-sm text-gray-600 leading-relaxed italic">"{f.description}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {feedbackList.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
            <Star className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-medium">No feedback history available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

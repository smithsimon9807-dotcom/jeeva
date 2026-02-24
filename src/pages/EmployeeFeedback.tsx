import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Award, 
  MessageSquare, 
  Calendar, 
  Clipboard,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';

export const EmployeeFeedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      fetch(`/api/employee/feedback/${user.id}`)
        .then(r => r.json())
        .then(setFeedbackList);
    }
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Performance Feedback</h1>
        <p className="text-gray-500 mt-1">Review feedback and scores from your supervisors.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {feedbackList.map((f, idx) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={f.feedback_id}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e75480]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
            
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 bg-[#e75480] text-white rounded-3xl shadow-lg shadow-[#e75480]/20 z-10">
              <Award size={32} className="mb-1" />
              <span className="text-3xl font-black">{f.mark}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Score</span>
            </div>

            <div className="flex-1 space-y-4 z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{f.feedback}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Clipboard size={16} className="text-[#e75480]" />
                      <span>Task: {f.task_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#e75480]" />
                      <span>Received: {f.created_at}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative">
                <MessageSquare size={20} className="text-[#e75480]/20 absolute top-4 right-4" />
                <p className="text-gray-600 leading-relaxed italic font-medium">
                  "{f.description}"
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {feedbackList.length === 0 && (
          <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center">
            <Star className="mx-auto text-gray-100 mb-6" size={64} />
            <h3 className="text-xl font-bold text-gray-900">No Feedback Yet</h3>
            <p className="text-gray-400 mt-2">Keep up the good work! Feedback from your manager will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Shield,
  Camera,
  Cake,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';

export const EmployeeProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      fetch(`/api/employee/profile/${user.id}`)
        .then(r => r.json())
        .then(setProfile);
    }
  }, []);

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Your personal and professional information.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-3xl bg-gray-100 overflow-hidden border-4 border-white shadow-lg mx-auto">
                {profile.proof ? (
                  <img 
                    src={`/static/uploads/${profile.proof}`} 
                    alt={profile.emp_name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <User size={48} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#e75480] text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                <Camera size={18} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.emp_name}</h2>
            <p className="text-[#e75480] font-semibold text-sm uppercase tracking-wider mt-1">{profile.role}</p>
            
            <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase">Department</p>
                <p className="text-sm font-bold text-gray-700 mt-1">{profile.department}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full uppercase mt-1">
                  {profile.status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Account Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Password</span>
                </div>
                <button className="text-xs font-bold text-[#e75480] hover:underline">Change</button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Email Address</p>
                  <p className="text-gray-700 font-medium mt-1">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cake size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Date of Birth</p>
                  <p className="text-gray-700 font-medium mt-1">{profile.dob}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Gender</p>
                  <p className="text-gray-700 font-medium mt-1">{profile.gender}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Joining Date</p>
                  <p className="text-gray-700 font-medium mt-1">{profile.doj}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Professional Summary</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Current Role</p>
                  <p className="text-gray-700 font-medium mt-1">Senior {profile.role} in {profile.department} Department</p>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    Responsible for executing high-priority tasks and collaborating with the team to achieve organizational goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

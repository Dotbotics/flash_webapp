/**
 * ADMIN/SUBMISSIONSVIEW.TSX
 * 
 * What it does:
 * Displays a list of contact form submissions fetched from the backend.
 * 
 * Why it exists:
 * To allow administrators to view and manage user inquiries.
 * 
 * Module: Admin / Components
 */

import { useState, useEffect } from 'react';
import { Trash2, Mail, Calendar, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Submission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export const SubmissionsView = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: number) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      setSubmissions(submissions.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete submission:', err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fb5b15]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#262626]">Form Submissions</h2>
        <span className="px-4 py-1 bg-[#fb5b15]/10 text-[#fb5b15] rounded-full text-xs font-bold uppercase tracking-wider">
          {submissions.length} Total
        </span>
      </div>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#eeeae9]/50 rounded-3xl border border-dashed border-black/10">
          <Mail className="w-12 h-12 text-black/10 mb-4" />
          <p className="text-black/40 font-bold">No submissions yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {submissions.map((s) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#eeeae9]/50 rounded-3xl p-8 border border-black/5 relative group hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => deleteSubmission(s.id)}
                  className="absolute top-6 right-6 p-2 text-black/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-[#262626]">
                      <User className="w-4 h-4 text-[#fb5b15]" />
                      <span className="font-bold">{s.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[#262626]/60">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{s.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[#262626]/60">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{new Date(s.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-[#262626]">
                      <MessageSquare className="w-4 h-4 text-[#fb5b15]" />
                      <span className="font-bold">{s.subject}</span>
                    </div>
                    <p className="text-[#262626]/70 text-sm leading-relaxed bg-white/50 p-4 rounded-2xl border border-black/5">
                      {s.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

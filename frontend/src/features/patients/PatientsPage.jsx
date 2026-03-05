import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { UserPlus, Mail, MapPin, Calendar, Trash2, Search, Filter, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', dob: '', gender: '', age: '', phone: '', email: '', city: '', zipcode: '', notes: '' });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await client.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await client.post('/patients', formData);
      setIsModalOpen(false);
      setFormData({ name: '', dob: '', gender: '', age: '', phone: '', email: '', city: '', zipcode: '', notes: '' });
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to register patient');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Security Protocol: Confirm permanent removal of patient medical record?')) return;
    try {
      await client.delete(`/patients/${id}`);
      setPatients(patients.filter(p => p.id !== id));
    } catch (err) {
      alert('Operation Failed');
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Registry</span>
          </div>
          <h2 className="text-3xl font-bold font-outfit">Patient Records</h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shrink-0 hover:cursor-pointer">
            <UserPlus size={16} />
            <span className="hidden sm:inline">Register Patient</span>
          </Button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-[2.5rem] border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 font-bold text-xs uppercase tracking-[0.2em] text-[var(--text-dim)]">Identified Profile</th>
                <th className="px-8 py-5 font-bold text-xs uppercase tracking-[0.2em] text-[var(--text-dim)]">Demographics</th>
                <th className="px-8 py-5 font-bold text-xs uppercase tracking-[0.2em] text-[var(--text-dim)]">Secure Contact</th>
                <th className="px-8 py-5 font-bold text-xs uppercase tracking-[0.2em] text-[var(--text-dim)]">Location</th>
                <th className="px-8 py-5 font-bold text-xs uppercase tracking-[0.2em] text-[var(--text-dim)] text-right">Operations</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredPatients.map((patient, index) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/10 shrink-0 text-sm">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{patient.name}</div>
                          <div className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                            <Calendar size={10} />
                            {patient.dob || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">
                          {patient.age || '??'} Yrs • {patient.gender || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium flex items-center gap-2">
                          <Mail size={10} className="text-[var(--text-dim)]" />
                          {patient.email}
                        </div>
                        <div className="text-[10px] text-[var(--text-dim)]">{patient.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium flex items-center gap-2">
                        <MapPin size={10} className="text-[var(--text-dim)]" />
                        {patient.city || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(patient.id)}
                        className="p-2 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && !isLoading && (
          <div className="py-32 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={28} className="text-[var(--text-dim)]" />
            </div>
            <p className="text-[var(--text-muted)] font-medium">No encrypted records matched your query.</p>
          </div>
        )}
      </div>

      {/* Register Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Security Registry: New Patient">
        <form onSubmit={handleCreate} className="space-y-6">
          <Input 
            label="Legal Identity" 
            required 
            placeholder="Search Full Name..."
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Chronological Marker (DOB)" 
              type="date"
              value={formData.dob}
              onChange={e => setFormData({...formData, dob: e.target.value})}
            />
            <Input 
              label="Gender Classification" 
              placeholder="..."
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Standard Age" 
              type="number"
              value={formData.age}
              onChange={e => setFormData({...formData, age: e.target.value})}
            />
            <Input 
              label="Contact Number" 
              placeholder="+91 ..."
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <Input 
            label="Email" 
            type="email"
            placeholder="identity@dummy.com"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Geo-Locator (City)" 
              value={formData.city}
              onChange={e => setFormData({...formData, city: e.target.value})}
            />
            <Input 
              label="Area Code (Zip)" 
              value={formData.zipcode}
              onChange={e => setFormData({...formData, zipcode: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] ml-1">Observational Notes</label>
            <textarea 
              rows={3}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>
          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="flex-1 px-6 py-4 rounded-2xl border border-[var(--border)] font-bold text-sm tracking-widest text-[var(--text-muted)] hover:bg-white/5 transition-all hover:cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-6 py-4 rounded-2xl bg-cyan-500 font-bold text-sm tracking-widest text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 transition-all hover:cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientsPage;

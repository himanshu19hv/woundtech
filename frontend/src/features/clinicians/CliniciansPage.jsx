import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { UserPlus, Mail, Phone, Stethoscope, Trash2, ArrowUpRight, Search, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CliniciansPage = () => {
  const [clinicians, setClinicians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', specialization: '', age: '', phone: '', email: '' });

  useEffect(() => {
    fetchClinicians();
  }, []);

  const fetchClinicians = async () => {
    try {
      const res = await client.get('/clinicians');
      setClinicians(res.data);
    } catch (err) {
      console.error('Failed to fetch clinicians', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await client.post('/clinicians', formData);
      setIsModalOpen(false);
      setFormData({ name: '', specialization: '', age: '', phone: '', email: '' });
      fetchClinicians();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add clinician');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Secure Protocol: Verify deletion of medical provider record?')) return;
    try {
      await client.delete(`/clinicians/${id}`);
      setClinicians(clinicians.filter(c => c.id !== id));
    } catch (err) {
      alert('Deletion Failed');
    }
  };

  const filteredClinicians = clinicians.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Stethoscope size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Management</span>
          </div>
          <h2 className="text-3xl font-bold font-outfit">Medical Staff</h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input 
              type="text" 
              placeholder="Search staff..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shrink-0 hover:cursor-pointer">
            <UserPlus size={16} />
            <span className="hidden sm:inline">Add Clinician</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredClinicians.map((clinician, index) => (
            <motion.div
              layout
              key={clinician.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 rounded-3xl group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <Stethoscope size={20} />
                </div>
                <button 
                  onClick={() => handleDelete(clinician.id)}
                  className="p-2 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold tracking-tight mb-0.5">{clinician.name}</h3>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] flex items-center gap-1.5">
                  <Activity size={10} />
                  {clinician.specialization || 'General Practice'}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-2.5 text-xs text-[var(--text-muted)]">
                  <Mail size={12} className="shrink-0" />
                  <span className="truncate">{clinician.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[var(--text-muted)]">
                  <Phone size={12} className="shrink-0" />
                  <span>{clinician.phone || 'No phone'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredClinicians.length === 0 && !isLoading && (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-[var(--border)] rounded-[2.5rem]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-[var(--text-dim)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Profiles Detected</h3>
            <p className="text-[var(--text-muted)] text-sm">Update your registry or adjust search parameters.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registry Addition">
        <form onSubmit={handleCreate} className="space-y-6">
          <Input 
            label="Legal Full Name" 
            required 
            placeholder="Dr. Example Name"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Clinical Specialization" 
            placeholder="e.g. Cardiology"
            value={formData.specialization}
            onChange={e => setFormData({...formData, specialization: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
                label="Age" 
                type="number"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
            />
            <Input 
                label="Verified Contact" 
                placeholder="+91 ..."
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <Input 
            label="Email" 
            type="email"
            placeholder="provider@hospital.com"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
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
              className="flex-1 px-6 py-4 rounded-2xl bg-[var(--primary)] font-bold text-sm tracking-widest text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all hover:cursor-pointer"
            >
              REGISTER
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CliniciansPage;

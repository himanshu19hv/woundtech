import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { Activity, Plus, Search, Filter, Clock, Calendar, CheckCircle, Trash2, ChevronRight, LayoutDashboard, BrainCircuit, Stethoscope, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VisitsPage = () => {
  const [visits, setVisits] = useState([]);
  const [clinicians, setClinicians] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filters
  const [filterClinician, setFilterClinician] = useState('');
  const [filterPatient, setFilterPatient] = useState('');

  // Form State
  const [formData, setFormData] = useState({ clinicianId: '', patientId: '', notes: ''});

  useEffect(() => {
    fetchData();
    fetchSupportData();
  }, []);

  const fetchData = async (cId = '', pId = '') => {
    try {
      let url = '/visits';
      const params = new URLSearchParams();
      if (cId) params.append('clinicianId', cId);
      if (pId) params.append('patientId', pId);
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await client.get(url);
      setVisits(res.data);
    } catch (err) {
      console.error('Failed to fetch visits', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSupportData = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        client.get('/clinicians'),
        client.get('/patients')
      ]);
      setClinicians(cRes.data);
      setPatients(pRes.data);
    } catch (err) {
      console.error('Failed to fetch support data', err);
    }
  };

  const handleCreateVisit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/visits', formData);
      setIsModalOpen(false);
      setFormData({ clinicianId: '', patientId: '', notes: '' });
      fetchData(filterClinician, filterPatient);
    } catch (err) {
      alert('Failed to record system visit');
    }
  };

  const handleDeleteVisit = async (id) => {
    if (!confirm('Operational Protocol: Confirm archival of system interaction log?')) return;
    try {
      await client.delete(`/visits/${id}`);
      setVisits(visits.filter(v => v.id !== id));
    } catch (err) {
      alert('Archival Error');
    }
  };

  const handleFilterChange = (type, val) => {
    if (type === 'clinician') {
      setFilterClinician(val);
      fetchData(val, filterPatient);
    } else {
      setFilterPatient(val);
      fetchData(filterClinician, val);
    }
  };

  return (
    <div className="space-y-10">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <BrainCircuit size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Activity Feed</span>
          </div>
          <h2 className="text-3xl font-bold font-outfit">Encounters</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
            <select 
              className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest px-3 py-2 outline-none cursor-pointer text-[var(--text-muted)]"
              value={filterClinician}
              onChange={(e) => handleFilterChange('clinician', e.target.value)}
            >
              <option value="" className="bg-[var(--surface)]">All Staff</option>
              {clinicians.map(c => <option key={c.id} value={c.id} className="bg-[var(--surface)]">{c.name}</option>)}
            </select>
            <div className="w-[1px] h-3 bg-white/10" />
            <select 
              className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest px-3 py-2 outline-none cursor-pointer text-[var(--text-muted)]"
              value={filterPatient}
              onChange={(e) => handleFilterChange('patient', e.target.value)}
            >
              <option value="" className="bg-[var(--surface)]">All Patients</option>
              {patients.map(p => <option key={p.id} value={p.id} className="bg-[var(--surface)]">{p.name}</option>)}
            </select>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 shrink-0 py-2.5"
          >
            <Plus size={16} />
            Add Visit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Visits', val: visits.length, icon: Activity, color: 'indigo' },
          { label: 'Clinicians', val: clinicians.length, icon: Stethoscope, color: 'indigo' },
          { label: 'Patients', val: patients.length, icon: UserCircle, color: 'indigo' },
        ].map((s, i) => (
          <div key={i} className="glass-panel px-6 py-4 rounded-2xl flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-dim)] mb-0.5">{s.label}</p>
              <h4 className="text-2xl font-bold font-outfit">{s.val}</h4>
            </div>
            <div className="p-3 bg-white/5 rounded-xl text-[var(--text-dim)] group-hover:text-indigo-400 transition-colors">
              <s.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-dim)] ml-2">Timeline</label>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {visits.map((visit, index) => (
              <motion.div
                key={visit.id}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-indigo-500/20 transition-all border-white/5"
              >
                <div className="flex items-center gap-4 min-w-[240px]">
                  <div className="w-10 h-10 bg-indigo-500/5 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/10">
                    <Activity size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-white">{visit.patient_name}</span>
                      <ChevronRight size={10} className="text-[var(--text-dim)]" />
                      <span className="text-xs font-bold text-indigo-400">{visit.clinician_name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider">
                         {new Date(visit?.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="w-1 h-1 bg-[var(--text-dim)] rounded-full" />
                      <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider">
                        {new Date(visit?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-xs text-[var(--text-muted)] italic py-1 px-4 border-l-2 border-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                   {visit.notes || 'No notes added.'}
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0 self-end md:self-auto">
                    <button 
                      onClick={() => handleDeleteVisit(visit.id)}
                      className="p-2 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {visits.length === 0 && !isLoading && (
            <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-[3rem]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutDashboard size={32} className="text-[var(--text-dim)]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Null Activity Stream</h3>
              <p className="text-[var(--text-muted)] text-sm">No medical logs discovered within the current temporal frame.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Activity Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create Appointment"
      >
        <form onSubmit={handleCreateVisit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] ml-1">Staff Authority</label>
              <select 
                required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-3.5 text-sm focus:border-indigo-500 outline-none transition-all"
                value={formData.clinicianId}
                onChange={(e) => setFormData({...formData, clinicianId: e.target.value})}
              >
                <option value="">Select Consultant</option>
                {clinicians.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] ml-1">Patient</label>
              <select 
                required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-3.5 text-sm focus:border-indigo-500 outline-none transition-all"
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
              >
                <option value="">Select Patient...</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] ml-1">Notes (if any)</label>
            <textarea 
              rows={4}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-4 text-sm focus:border-indigo-500 outline-none transition-all"
              placeholder="Record clinical observations and system analysis..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="flex-1 px-6 py-4 rounded-2xl border border-[var(--border)] font-bold text-sm tracking-widest text-[var(--text-muted)] hover:bg-white/5 transition-all"
            >
              CANCEL
            </button>
            <button 
              type="submit" 
              className="flex-1 px-6 py-4 rounded-2xl bg-indigo-500 font-bold text-sm tracking-widest text-white hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 transition-all"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Add CSS variables for stats colors if not in index.css
// --indigo: 245, 80%, 65%
// --purple: 270, 80%, 65%
// --cyan: 190, 80%, 45%

export default VisitsPage;

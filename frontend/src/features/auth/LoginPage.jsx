import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      setError('');
    } else {
      setError('System Access Denied');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 bg-[#030712] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="login relative z-10"
      >
        <div className="glass-panel p-10 sm:p-14 rounded-[3.5rem] flex flex-col items-center">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-3xl font-bold font-outfit tracking-tight mb-2 uppercase text-white text-gradient-primary">
             WoundTech
            </h1>
            {/* <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--text-dim)]">
              Authorized Personnel Only
            </p> */}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-10 flex flex-col items-center">
            <div className="w-full space-y-6">
              <Input
                label="Username"
                type="email"
                icon={""}
                placeholder="admin@tracker.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                icon={""}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-rose-500 text-[10px] font-bold uppercase tracking-[0.2em] bg-rose-500/5 px-4 py-2 rounded-full border border-rose-500/10"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full max-w-[280px] py-4 text-[10px] uppercase tracking-[0.3em]"
            >
              Submit
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Credentials Block */}
            <div className="pt-8 flex flex-col items-center w-full">
              <div className="flex items-center gap-3 w-full mb-4">
                <div className="h-[1px] flex-1 bg-white/5" />
                <span className="text-[9px] font-bold text-[var(--text-dim)] uppercase tracking-[0.2em]">Activity Tracker</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <div className="px-5 py-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-default">
                <p className="text-[9px] text-[var(--text-muted)] font-bold tracking-wider">
                  USER: <span className="text-white">admin@tracker.com</span> &nbsp;•&nbsp; PASS: <span className="text-white">admin123</span>
                </p>
              </div>
            </div>
          </form>
        </div>
        
        {/* Environment Tag */}
        <div className="mt-10 text-center flex items-center justify-center gap-3 opacity-30">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {/* <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-white">
            System Online: 24/7 Monitoring
          </p> */}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

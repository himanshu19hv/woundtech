import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[1001] p-6"
            
          >
            <div className="glass-panel p-8 rounded-[1.5rem] shadow-2xl relative overflow-hidden" style={{gap: 14,
              padding: 6}}>
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--primary)]/10 blur-[60px] rounded-full" />
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-2xl font-bold font-outfit tracking-tight">{title}</h3>
                <button 
                  onClick={onClose} 
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
                >
                  <X size={20} className="text-[var(--text-dim)] group-hover:text-white" />
                </button>
              </div>
              
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

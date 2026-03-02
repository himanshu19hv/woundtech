import React from 'react';

const Input = ({ label, error, icon: Icon, className = '', containerClassName = '', ...props }) => {
  return (
    <div className={`flex flex-col items-center gap-2 w-full ${containerClassName}`}>
      {label && (
        <label className="text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--text-dim)] transition-colors">
          {label}
        </label>
      )}
      <div className="relative w-full max-w-[320px] group">
        {Icon && (
          <Icon 
            size={16} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-indigo-400 transition-colors pointer-events-none" 
          />
        )}
        <input
        style={{padding: "0.5rem", width: "100%"}}
          className={`
            w-100 bg-white/5 border rounded-xl outline-none transition-all text-sm text-center
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${error ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/5 focus:border-indigo-500/40'}
            py-3
            ${className}
          `}
          {...props}
        />
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-indigo-500/0 group-focus-within:bg-indigo-500/5 -z-10 blur-xl transition-all duration-500" />
      </div>
      {error && (
        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;

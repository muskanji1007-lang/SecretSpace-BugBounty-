import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { CheckCircle2, AlertCircle, Info, X } from './icons.jsx';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let borderClass = 'border-border bg-card text-main';
        let Icon = Info;
        let iconColor = 'text-primary';

        if (toast.type === 'success') {
          borderClass = 'border-success/40 bg-card text-main';
          Icon = CheckCircle2;
          iconColor = 'text-success';
        } else if (toast.type === 'error') {
          borderClass = 'border-danger/40 bg-card text-main';
          Icon = AlertCircle;
          iconColor = 'text-danger';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg shadow-deep/5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted hover:text-main p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

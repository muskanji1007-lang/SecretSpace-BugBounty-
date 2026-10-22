import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { ShieldAlert, X, AlertTriangle } from './icons.jsx';

const REPORT_REASONS = [
  'Personal Information / Doxxing risk',
  'Targeted Harassment or Bullying',
  'Hate Speech or Discrimination',
  'Academic Dishonesty / Cheating',
  'Spam / Commercial advertising',
  'Misinformation / Dangerous rumors',
];

export default function ReportModal({ isOpen, onClose, post }) {
  const { reportItem } = useApp();
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');

  if (!isOpen || !post) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    reportItem({
      postId: post.id,
      reason: selectedReason,
      snippet: post.content.substring(0, 100) + '...',
      reportedItemType: 'post',
      details: details.trim(),
    });
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-main/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-card rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-border relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-main hover:bg-surface transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-surface text-danger flex items-center justify-center border border-border">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-main text-lg">Report Post Anonymously</h3>
            <p className="text-xs text-muted">Your report remains 100% confidential</p>
          </div>
        </div>

        <div className="bg-surface/40 p-3 rounded-xl border border-border text-xs text-main mb-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="line-clamp-2 italic">
            "{post.content}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-main uppercase tracking-wider mb-2">
              Reason for reporting
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-sm cursor-pointer transition ${
                    selectedReason === reason
                      ? 'border-primary bg-surface/50 text-deep font-semibold ring-1 ring-primary'
                      : 'border-border hover:bg-surface/30 text-main'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-primary"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-main uppercase tracking-wider mb-1.5">
              Additional Details (Optional)
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Help moderators understand what went wrong..."
              className="w-full text-sm p-3 rounded-xl border border-border bg-canvas focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main placeholder:text-muted resize-none"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-border text-muted hover:bg-surface font-medium text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-danger hover:opacity-95 text-white font-medium text-sm shadow-md shadow-danger/20 transition cursor-pointer"
            >
              Submit Flag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

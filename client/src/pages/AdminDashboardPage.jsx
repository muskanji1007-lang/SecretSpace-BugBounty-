import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import {
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Clock,
  Check,
} from '../components/common/icons.jsx';

export default function AdminDashboardPage() {
  const { reports, resolveReport } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const resolvedReports = reports.filter((r) => r.status !== 'pending');

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'pending') return r.status === 'pending';
    if (filterStatus === 'resolved') return r.status !== 'pending';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-deep text-base">Campus Moderation Desk</h2>
            <p className="text-xs text-muted">
              Review confidential student flags to uphold safety and anonymity
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-surface text-deep border border-border">
          Admin Preview Mode
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-2xs">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">
            Pending Flags
          </span>
          <span className="text-2xl font-black text-deep mt-1 block">
            {pendingReports.length}
          </span>
          <span className="text-[10px] text-warning font-medium">Needs Attention</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-2xs">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">
            Resolved Flags
          </span>
          <span className="text-2xl font-black text-success mt-1 block">
            {resolvedReports.length}
          </span>
          <span className="text-[10px] text-success font-medium">Addressed</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-2xs">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">
            Campus Safety Score
          </span>
          <span className="text-2xl font-black text-deep mt-1 block">
            99.2%
          </span>
          <span className="text-[10px] text-primary font-medium">Healthy Community</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-2xs">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">
            Active Guidelines
          </span>
          <span className="text-2xl font-black text-deep mt-1 block">
            6 Rules
          </span>
          <span className="text-[10px] text-muted font-medium">Enforced automatically</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:bg-surface'
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:bg-surface'
            }`}
          >
            Pending ({pendingReports.length})
          </button>
          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filterStatus === 'resolved'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:bg-surface'
            }`}
          >
            Resolved ({resolvedReports.length})
          </button>
        </div>
      </div>

      {filteredReports.length > 0 ? (
        <div className="space-y-3.5">
          {filteredReports.map((report) => {
            const isPending = report.status === 'pending';

            return (
              <div
                key={report.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-danger bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        {report.reason}
                      </span>
                      <span className="text-[11px] text-muted">
                        Target: {report.reportedItemType.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-muted mt-1 flex items-center gap-2">
                      <span>Flagged by: {report.flaggedBy}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.timestamp}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      isPending
                        ? 'bg-amber-50 text-warning border border-amber-200'
                        : report.status === 'content_removed'
                        ? 'bg-rose-50 text-danger border border-rose-200'
                        : 'bg-surface text-muted border border-border'
                    }`}
                  >
                    {report.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface/40 border border-border text-xs text-main italic">
                  "{report.snippet}"
                </div>

                {isPending && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => resolveReport(report.id, 'dismiss')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-main hover:bg-surface text-xs font-semibold transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Dismiss Flag</span>
                    </button>

                    <button
                      onClick={() => resolveReport(report.id, 'remove')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-danger hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Content</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={ShieldCheck}
          title="Moderation queue is clean"
          description="No flagged secrets in this filter. Campus is currently peaceful!"
        />
      )}
    </div>
  );
}

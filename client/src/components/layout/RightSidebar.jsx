import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { TrendingUp, Vote, ShieldCheck, ChevronRight } from '../common/icons.jsx';

const TRENDING_TOPICS = [
  { tag: '#AttendanceCriteria', posts: '142 posts', badge: 'Hot' },
  { tag: '#OperatingSystems', posts: '98 posts' },
  { tag: '#LibraryQuietHours', posts: '76 posts' },
  { tag: '#MessPaneerMystery', posts: '64 posts', badge: 'Meme' },
  { tag: '#PlacementSeason', posts: '53 posts' },
];

export default function RightSidebar() {
  const { polls, votePoll } = useApp();
  const activePoll = polls.find((p) => p.status === 'active') || polls[0];

  return (
    <aside className="w-80 shrink-0 hidden xl:block space-y-5 p-4 sticky top-0 h-screen overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Active Campus Poll Widget */}
      {activePoll && (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-deep">
              <Vote className="w-4 h-4 text-primary" />
              <span>Campus Pulse</span>
            </div>
            <span className="text-[11px] font-medium text-muted">
              {activePoll.expiresIn}
            </span>
          </div>

          <h4 className="font-semibold text-main text-sm mb-3 leading-snug">
            {activePoll.question}
          </h4>

          <div className="space-y-2 mb-3">
            {activePoll.options.map((opt) => {
              const percentage = activePoll.totalVotes
                ? Math.round((opt.votes / activePoll.totalVotes) * 100)
                : 0;
              const isSelected = activePoll.userSelectedOption === opt.id;

              // BUG-05: Omits poll status check (isClosed), allowing voting on expired sidebar polls
              const showResults = activePoll.hasVoted;

              return (
                <button
                  key={opt.id}
                  disabled={showResults}
                  onClick={() => votePoll(activePoll.id, opt.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium relative overflow-hidden transition cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-surface text-deep font-semibold'
                      : 'border-border hover:border-primary/50 text-main bg-canvas/60'
                  }`}
                >
                  {showResults && (
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/20 transition-all duration-500 z-0"
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="truncate pr-2">{opt.text}</span>
                    {showResults && (
                      <span className="font-bold shrink-0 text-deep">
                        {percentage}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted pt-2 border-t border-border">
            <span>{activePoll.totalVotes} student votes</span>
            <Link
              to="/polls"
              className="text-primary font-semibold hover:text-deep hover:underline flex items-center gap-0.5"
            >
              All Polls <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Trending Topics Widget */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-deep mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Trending on Campus</span>
        </div>

        <div className="space-y-2.5">
          {TRENDING_TOPICS.map((item, idx) => (
            <Link
              key={idx}
              to={`/explore?q=${encodeURIComponent(item.tag)}`}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface/60 transition group"
            >
              <div>
                <div className="text-xs font-semibold text-main group-hover:text-primary transition">
                  {item.tag}
                </div>
                <div className="text-[11px] text-muted">{item.posts}</div>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface text-deep border border-border">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Honor Code & Safety */}
      <div className="p-4 rounded-2xl bg-surface/40 border border-border text-xs text-muted space-y-2">
        <div className="flex items-center gap-2 text-deep font-bold">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>The SecretSpace Honor Code</span>
        </div>
        <p className="text-[11px] text-muted leading-relaxed">
          No real names, phone numbers, or targeted bullying. All posts are filtered by community moderation to keep campus safe.
        </p>
        <div className="pt-1">
          <Link
            to="/settings"
            className="text-[11px] font-semibold text-primary hover:text-deep hover:underline flex items-center gap-1"
          >
            Review Safety Guidelines <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

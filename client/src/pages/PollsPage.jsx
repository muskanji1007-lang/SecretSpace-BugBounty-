import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import {
  Vote,
  PlusCircle,
  CheckCircle2,
  Clock,
  X,
} from '../components/common/icons.jsx';

export default function PollsPage() {
  const { polls, votePoll, createPoll, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('active');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [collegeTag, setCollegeTag] = useState('Campus Poll');

  const filteredPolls = polls.filter((p) =>
    activeTab === 'active' ? p.status === 'active' : p.status === 'closed'
  );

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    } else {
      addToast('Maximum 4 options allowed per poll', 'info');
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) {
      addToast('Please enter a poll question', 'error');
      return;
    }
    const validOptions = options.map((o) => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      addToast('Please provide at least 2 non-empty options', 'error');
      return;
    }

    createPoll({
      question: question.trim(),
      options: validOptions,
      collegeTag: collegeTag.trim() || 'Campus Pulse',
    });

    setQuestion('');
    setOptions(['', '']);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface text-deep flex items-center justify-center">
            <Vote className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-deep text-base">Campus Polls</h2>
            <p className="text-xs text-muted">
              Cast your vote anonymously on campus decisions & hot topics
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-sm shadow-primary/20 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Poll</span>
        </button>
      </div>

      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'active'
              ? 'border-primary text-deep'
              : 'border-transparent text-muted hover:text-deep'
          }`}
        >
          Active Polls ({polls.filter((p) => p.status === 'active').length})
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'closed'
              ? 'border-primary text-deep'
              : 'border-transparent text-muted hover:text-deep'
          }`}
        >
          Closed & Results ({polls.filter((p) => p.status === 'closed').length})
        </button>
      </div>

      {filteredPolls.length > 0 ? (
        <div className="space-y-4">
          {filteredPolls.map((poll) => (
            <div
              key={poll.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs text-muted mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-main">
                    {poll.authorPseudonym}
                  </span>
                  <span>•</span>
                  <span className="text-deep font-medium bg-surface px-2 py-0.5 rounded-full border border-border">
                    {poll.collegeTag}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{poll.expiresIn}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-main mb-4 leading-snug">
                {poll.question}
              </h3>

              <div className="space-y-2.5">
                {poll.options.map((option) => {
                  const percentage = poll.totalVotes
                    ? Math.round((option.votes / poll.totalVotes) * 100)
                    : 0;
                  const isSelected = poll.userSelectedOption === option.id;

                  return (
                    <button
                      key={option.id}
                      disabled={poll.hasVoted}
                      onClick={() => votePoll(poll.id, option.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium relative overflow-hidden transition cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-surface/60 text-deep font-semibold ring-1 ring-primary'
                          : 'border-border hover:border-primary/50 text-main bg-card'
                      }`}
                    >
                      {poll.hasVoted && (
                        <div
                          className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                            isSelected ? 'bg-primary/20' : 'bg-surface'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          )}
                          <span>{option.text}</span>
                        </div>

                        {poll.hasVoted && (
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-muted text-[11px]">
                              {option.votes} vote{option.votes === 1 ? '' : 's'}
                            </span>
                            <span className="font-bold text-deep">
                              {percentage}%
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-muted mt-4 pt-3 border-t border-border">
                <span>
                  {poll.totalVotes} total response{poll.totalVotes === 1 ? '' : 's'}
                </span>
                {poll.hasVoted && (
                  <span className="text-success font-medium">
                    ✓ You voted anonymously
                  </span>
                )}
                {poll.status === 'closed' && (
                  <span className="text-warning font-medium">Voting ended</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Vote}
          title={activeTab === 'active' ? 'No active polls right now' : 'No past polls yet'}
          description="Have a question you want the campus to vote on? Start a campus poll."
          actionLabel="Create a Poll"
          onAction={() => setIsCreateModalOpen(true)}
        />
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-main/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-main hover:bg-surface transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-surface text-deep flex items-center justify-center">
                <Vote className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-deep text-base">New Campus Poll</h3>
                <p className="text-xs text-muted">Anonymous student voting</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-main mb-1">
                  Poll Question *
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Which library floor has the best WiFi?"
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-canvas focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary text-main placeholder:text-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">
                  Options (2 to 4) *
                </label>
                <div className="space-y-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 text-xs p-2.5 rounded-xl border border-border bg-canvas focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary text-main placeholder:text-muted"
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="p-2 text-muted hover:text-danger rounded-lg cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {options.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="mt-2 text-xs font-semibold text-primary hover:text-deep flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add another option</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-main mb-1">
                  Target Tag / Group
                </label>
                <input
                  type="text"
                  value={collegeTag}
                  onChange={(e) => setCollegeTag(e.target.value)}
                  placeholder="e.g. Hostels / Computer Science"
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-canvas focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary text-main placeholder:text-muted"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-border text-muted hover:bg-surface font-medium text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium text-xs shadow-md shadow-primary/20 transition cursor-pointer"
                >
                  Publish Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

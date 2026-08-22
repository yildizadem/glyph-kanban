import React, { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Sliders, 
  ArrowRight,
  Flame,
  Layers,
  Sparkles,
  PieChart,
  Calendar
} from 'lucide-react';
import { Status, Priority } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    metrics, 
    assigneeAnalytics, 
    logs, 
    users, 
    cards, 
    wipLimits, 
    setWipLimit, 
    permissions,
    setCurrentUser
  } = useBoard();

  const [activeTab, setActiveTab] = useState<'overview' | 'workload' | 'audit' | 'settings'>('overview');

  // If user is not admin, show nice banner with quick switch button
  if (!permissions.isAdmin) {
    const adminUser = users.find(u => u.role === 'Admin') || users[0];
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4 text-indigo-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Admin Metrics & Insights</h2>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          The analytics engine is restricted to users with the <strong className="text-purple-400">Admin</strong> role. Switch your simulated profile to view comprehensive team metrics, cycle times, workload distribution, and bottleneck alerts.
        </p>
        <button
          onClick={() => setCurrentUser(adminUser)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          <span>Switch to Admin ({adminUser.name})</span>
        </button>
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const priorityCounts: Record<Priority, number> = {
    Urgent: cards.filter(c => c.priority === 'Urgent').length,
    High: cards.filter(c => c.priority === 'High').length,
    Medium: cards.filter(c => c.priority === 'Medium').length,
    Low: cards.filter(c => c.priority === 'Low').length,
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
      {/* Top Header & Subnav */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 glass-panel">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Admin Executive Analytics</h2>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              Glyph Analytics Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time team throughput, cycle times, and bottleneck detection</p>
        </div>

        {/* Subnav Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('workload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'workload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Team Workload
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit Log ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            WIP Limits
          </button>
        </div>
      </div>

      {/* Bottleneck Alert Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
        metrics.inProgressCards > wipLimits.InProgress || metrics.inReviewCards > wipLimits.InReview
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
          : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            metrics.inProgressCards > wipLimits.InProgress || metrics.inReviewCards > wipLimits.InReview
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Flow Diagnostic Status</h4>
            <p className="text-xs opacity-90 mt-0.5">{metrics.bottleneckWarning}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
            WIP InProgress: {metrics.inProgressCards}/{wipLimits.InProgress}
          </span>
          <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
            WIP InReview: {metrics.inReviewCards}/{wipLimits.InReview}
          </span>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key KPI Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Health Score */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Board Health Score</span>
                <Sparkles className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{metrics.healthScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      metrics.healthScore >= 80 ? 'bg-emerald-500' : metrics.healthScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${metrics.healthScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Total Completion Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{metrics.completionRate}%</span>
                <span className="text-xs text-slate-500">({metrics.completedCards}/{metrics.totalCards} done)</span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-sky-400"
                    style={{ width: `${metrics.completionRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cycle Time */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Avg Cycle Time</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{metrics.avgCycleTimeHours}</span>
                <span className="text-xs text-slate-400">hours ({Math.round((metrics.avgCycleTimeHours / 24) * 10) / 10} days)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Started to Done duration</p>
            </div>

            {/* Lead Time */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Avg Lead Time</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{metrics.avgLeadTimeHours}</span>
                <span className="text-xs text-slate-400">hours ({Math.round((metrics.avgLeadTimeHours / 24) * 10) / 10} days)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Creation to Done duration</p>
            </div>
          </div>

          {/* Cumulative Flow & Column Distribution Bar */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Workflow Distribution Across Pipeline
            </h3>
            
            {/* Multi-segment Progress Bar */}
            <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-800 p-0.5 gap-0.5">
              {metrics.backlogCards > 0 && (
                <div
                  style={{ width: `${(metrics.backlogCards / metrics.totalCards) * 100}%` }}
                  className="bg-slate-600 hover:bg-slate-500 transition-all rounded-l flex items-center justify-center text-[10px] font-bold text-white"
                  title={`Backlog: ${metrics.backlogCards}`}
                >
                  {metrics.backlogCards}
                </div>
              )}
              {metrics.todoCards > 0 && (
                <div
                  style={{ width: `${(metrics.todoCards / metrics.totalCards) * 100}%` }}
                  className="bg-sky-500 hover:bg-sky-400 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                  title={`Todo: ${metrics.todoCards}`}
                >
                  {metrics.todoCards}
                </div>
              )}
              {metrics.inProgressCards > 0 && (
                <div
                  style={{ width: `${(metrics.inProgressCards / metrics.totalCards) * 100}%` }}
                  className="bg-amber-500 hover:bg-amber-400 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                  title={`In Progress: ${metrics.inProgressCards}`}
                >
                  {metrics.inProgressCards}
                </div>
              )}
              {metrics.inReviewCards > 0 && (
                <div
                  style={{ width: `${(metrics.inReviewCards / metrics.totalCards) * 100}%` }}
                  className="bg-purple-500 hover:bg-purple-400 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                  title={`In Review: ${metrics.inReviewCards}`}
                >
                  {metrics.inReviewCards}
                </div>
              )}
              {metrics.completedCards > 0 && (
                <div
                  style={{ width: `${(metrics.completedCards / metrics.totalCards) * 100}%` }}
                  className="bg-emerald-500 hover:bg-emerald-400 transition-all rounded-r flex items-center justify-center text-[10px] font-bold text-white"
                  title={`Done: ${metrics.completedCards}`}
                >
                  {metrics.completedCards}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-xs text-slate-400 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-600" />
                <span>Backlog ({metrics.backlogCards})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-sky-500" />
                <span>To Do ({metrics.todoCards})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>In Progress ({metrics.inProgressCards})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500" />
                <span>In Review ({metrics.inReviewCards})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Completed ({metrics.completedCards})</span>
              </div>
            </div>
          </div>

          {/* Two Columns: Priority Matrix & Time Tracking Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Priority Matrix */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                Priority Distribution
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                    <span className="text-xs font-semibold text-rose-300">Urgent</span>
                  </div>
                  <span className="text-xs font-bold text-white">{priorityCounts.Urgent} tasks</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-semibold text-amber-300">High</span>
                  </div>
                  <span className="text-xs font-bold text-white">{priorityCounts.High} tasks</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span className="text-xs font-semibold text-sky-300">Medium</span>
                  </div>
                  <span className="text-xs font-bold text-white">{priorityCounts.Medium} tasks</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span className="text-xs font-semibold text-slate-300">Low</span>
                  </div>
                  <span className="text-xs font-bold text-white">{priorityCounts.Low} tasks</span>
                </div>
              </div>
            </div>

            {/* Time Tracking & Estimates Summary */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                Time & Effort Tracking
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400">Total Estimated</span>
                  <p className="text-xl font-bold text-white mt-1">{metrics.totalEstimatedHours}h</p>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400">Total Logged</span>
                  <p className="text-xl font-bold text-sky-400 mt-1">{metrics.totalSpentHours}h</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Burn-down Progress</span>
                  <span className="font-semibold text-slate-200">
                    {metrics.totalEstimatedHours > 0
                      ? `${Math.round((metrics.totalSpentHours / metrics.totalEstimatedHours) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500"
                    style={{
                      width: `${Math.min(100, metrics.totalEstimatedHours > 0 ? (metrics.totalSpentHours / metrics.totalEstimatedHours) * 100 : 0)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WORKLOAD TAB */}
      {activeTab === 'workload' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assigneeAnalytics.map(stat => (
              <div key={stat.user.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={stat.user.avatarUrl}
                    alt={stat.user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{stat.user.name}</h4>
                    <p className="text-[11px] text-slate-400">{stat.user.title || stat.user.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 mb-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400">Assigned</span>
                    <p className="text-sm font-bold text-white mt-0.5">{stat.assignedCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">In Progress</span>
                    <p className="text-sm font-bold text-amber-400 mt-0.5">{stat.inProgressCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Done</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">{stat.completedCount}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Task Completion</span>
                    <span className="font-semibold text-slate-200">{stat.completionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${stat.completionRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Hours: {stat.totalSpentHours}h logged / {stat.totalEstimatedHours}h est</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIT LOG TAB */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Complete Board Audit Trail
          </h3>
          <div className="divide-y divide-slate-800/80">
            {logs.map(log => {
              const logUser = users.find(u => u.id === log.userId);
              return (
                <div key={log.id} className="py-3 flex items-start gap-3">
                  <img
                    src={logUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={logUser?.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{logUser?.name || 'System'}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                          log.action === 'create'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                            : log.action === 'move'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : log.action === 'delete'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        }`}>
                          {log.action.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{log.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel max-w-xl">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            WIP (Work In Progress) Limit Controls
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            Configure column thresholds. When cards exceed the WIP limit, the Glyph analytics engine flags flow bottlenecks.
          </p>

          <div className="space-y-4">
            {(Object.keys(wipLimits) as Status[]).map(status => (
              <div key={status} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-semibold text-slate-200">{status}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={wipLimits[status]}
                    onChange={(e) => setWipLimit(status, parseInt(e.target.value) || 1)}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white text-center font-mono focus:outline-none focus:border-sky-500"
                  />
                  <span className="text-[11px] text-slate-500">cards max</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

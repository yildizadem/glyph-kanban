import React, { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { 
  Kanban, 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  UserCheck, 
  ShieldAlert, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles,
  ChevronDown,
  User as UserIcon,
  Tag,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { User, Priority, Status } from '../types';

interface HeaderProps {
  onOpenNewCardModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewCardModal }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    activeView, 
    setActiveView, 
    filter, 
    setFilter, 
    resetFilters,
    permissions,
    metrics,
    exportData,
    importData,
    resetToDefaults
  } = useBoard();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');

  const handleExport = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kanban-board-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setImportError('');
    if (!importJsonText.trim()) return;
    const res = importData(importJsonText);
    if (res.success) {
      setShowExportModal(false);
      setImportJsonText('');
    } else {
      setImportError(res.error || 'Failed to import JSON data');
    }
  };

  const isAssignedToMe = filter.assigneeId === currentUser.id;
  const isReportedByMe = filter.reporterId === currentUser.id;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-6 py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Brand & View Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Kanban className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">Glyph<span className="text-sky-400">Kanban</span></span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Glyph v0.1
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Role-Driven Agile & Analytics</p>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView('board')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'board'
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>

            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeView === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Analytics</span>
              {metrics.overdueCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>

        {/* Right: Actions, Search, Role Switcher */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-56 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, tags, IDs..."
              value={filter.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            {filter.search && (
              <button 
                onClick={() => setFilter({ search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilter(prev => ({ ...prev, assigneeId: isAssignedToMe ? '' : currentUser.id }))}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                isAssignedToMe ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Filter tasks assigned to current user"
            >
              Assigned to me
            </button>
            <button
              onClick={() => setFilter(prev => ({ ...prev, reporterId: isReportedByMe ? '' : currentUser.id }))}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                isReportedByMe ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Filter tasks reported by current user"
            >
              Reported by me
            </button>
            {(filter.search || filter.assigneeId || filter.reporterId || filter.priority || filter.tag) && (
              <button
                onClick={resetFilters}
                className="px-2 py-1 text-slate-400 hover:text-rose-400 text-xs font-medium transition-colors"
                title="Clear all active filters"
              >
                Clear
              </button>
            )}
          </div>

          {/* New Task Button (Governed by Glyph permission can_create_card) */}
          <button
            onClick={onOpenNewCardModal}
            disabled={!permissions.canCreate}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              permissions.canCreate
                ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/25 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
            title={permissions.canCreate ? 'Create a new task card' : 'Only Admins and Reporters can create cards'}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>

          {/* Role & User Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-left"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">{currentUser.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                    currentUser.role === 'Admin'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : currentUser.role === 'Reporter'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 glass-panel">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-semibold text-slate-200">Switch Simulated User / Role</p>
                  <p className="text-[11px] text-slate-400">Test different permissions enforced by Glyph RBAC</p>
                </div>
                <div className="space-y-1">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                        currentUser.id === u.id
                          ? 'bg-sky-500/15 border border-sky-500/30 text-white'
                          : 'hover:bg-slate-800/70 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-semibold">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.title || u.email}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        u.role === 'Admin'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : u.role === 'Reporter'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      }`}>
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between px-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setShowExportModal(true);
                    }}
                    className="text-[11px] text-slate-400 hover:text-sky-400 flex items-center gap-1 py-1"
                  >
                    <Download className="w-3 h-3" /> Backup / Import
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Reset board to sample initial tasks and activity logs?')) {
                        resetToDefaults();
                        setShowUserDropdown(false);
                      }
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 py-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Demo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backup & Import Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl glass-panel">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-sky-400" />
                Board Data Backup & Restore
              </h3>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Export Current Board</label>
                <p className="text-xs text-slate-400 mb-2">Download a JSON snapshot of all cards, metrics history, and activity logs.</p>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" /> Download JSON Backup
                </button>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Import Board Snapshot</label>
                <p className="text-xs text-slate-400 mb-2">Paste a previously exported JSON backup to restore board state.</p>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='{"cards": [...], "logs": [...]}'
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                />
                {importError && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {importError}
                  </p>
                )}
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportSubmit}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white transition-colors"
                  >
                    Import & Overwrite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

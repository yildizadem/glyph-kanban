import React, { useState, useEffect } from 'react';
import { TaskCard, User, Status, Priority } from '../types';
import { useBoard } from '../context/BoardContext';
import { 
  X, 
  Trash2, 
  Save, 
  Clock, 
  Calendar, 
  User as UserIcon, 
  Tag, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Flame,
  FileText,
  Shield
} from 'lucide-react';

interface CardModalProps {
  card: TaskCard | null;
  defaultStatus?: Status;
  isOpen: boolean;
  onClose: () => void;
}

const STATUSES: Status[] = ['Backlog', 'Todo', 'InProgress', 'InReview', 'Done'];
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];

export const CardModal: React.FC<CardModalProps> = ({
  card,
  defaultStatus = 'Backlog',
  isOpen,
  onClose
}) => {
  const { 
    users, 
    currentUser, 
    createCard, 
    updateCard, 
    deleteCard, 
    reassignCard,
    permissions, 
    logs 
  } = useBoard();

  const isEditing = !!card;

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [priority, setPriority] = useState<Priority>('Medium');
  const [reporterId, setReporterId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [spentHours, setSpentHours] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [errorMessage, setErrorMessage] = useState('');

  // Populate form when card changes
  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setStatus(card.status);
      setPriority(card.priority);
      setReporterId(card.reporterId);
      setAssigneeId(card.assigneeId);
      setEstimatedHours(card.estimatedHours || 0);
      setSpentHours(card.spentHours || 0);
      setDueDate(card.dueDate || '');
      setTags(card.tags || []);
    } else {
      // Default new card
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('Medium');
      setReporterId(currentUser.id);
      setAssigneeId(users.find(u => u.role === 'Assignee')?.id || users[0].id);
      setEstimatedHours(4);
      setSpentHours(0);
      const defaultDue = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0];
      setDueDate(defaultDue);
      setTags(['Feature']);
    }
    setErrorMessage('');
    setActiveTab('details');
  }, [card, defaultStatus, isOpen, currentUser, users]);

  if (!isOpen) return null;

  const cardLogs = card ? logs.filter(l => l.cardId === card.id) : [];

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a task title.');
      return;
    }

    if (isEditing && card) {
      // If assignee changed, perform reassign check
      if (assigneeId !== card.assigneeId && permissions.canReassign()) {
        reassignCard(card.id, assigneeId);
      }

      const res = updateCard(card.id, {
        title,
        description,
        status,
        priority,
        reporterId,
        assigneeId,
        estimatedHours: Number(estimatedHours) || 0,
        spentHours: Number(spentHours) || 0,
        dueDate,
        tags
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Update failed');
        return;
      }
    } else {
      const res = createCard({
        title,
        description,
        status,
        priority,
        reporterId: reporterId || currentUser.id,
        assigneeId,
        estimatedHours: Number(estimatedHours) || 0,
        spentHours: Number(spentHours) || 0,
        dueDate,
        tags
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Creation failed');
        return;
      }
    }

    onClose();
  };

  const handleDelete = () => {
    if (!card) return;
    if (confirm(`Are you sure you want to delete "${card.title}"?`)) {
      const res = deleteCard(card.id);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.message || 'Failed to delete card');
      }
    }
  };

  const canEdit = card ? permissions.canEdit(card) : permissions.canCreate;
  const canDelete = card ? permissions.canDelete(card) : false;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden glass-panel my-8">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/30">
              {isEditing ? card?.id : 'NEW TASK'}
            </span>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeTab === 'details' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Details
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'history' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  <span>Audit Trail ({cardLogs.length})</span>
                </button>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        {activeTab === 'details' ? (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[calc(85vh-140px)] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Task Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g. Refactor Kanban data engine in Glyph..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Status & Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  {STATUSES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  {PRIORITIES.map(pr => (
                    <option key={pr} value={pr}>{pr}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description & Acceptance Criteria</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide task context, requirements, acceptance criteria, or reproduction steps..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Reporter & Assignee (RBAC Key Features) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              {/* Reporter */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                    Reporter (Creator)
                  </span>
                  <span className="text-[10px] text-slate-500">Author</span>
                </label>
                <select
                  value={reporterId}
                  onChange={(e) => setReporterId(e.target.value)}
                  disabled={!permissions.isAdmin}
                  className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 ${
                    !permissions.isAdmin ? 'opacity-80 cursor-not-allowed' : ''
                  }`}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                    Assignee (Worker)
                  </span>
                  <span className="text-[10px] text-slate-500">Engineer</span>
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  disabled={!permissions.canReassign()}
                  className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 ${
                    !permissions.canReassign() ? 'opacity-80 cursor-not-allowed' : ''
                  }`}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Tracking & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimated Hours</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Spent Hours</span>
                  <button
                    type="button"
                    onClick={() => setSpentHours(prev => prev + 1)}
                    className="text-[10px] text-sky-400 hover:text-sky-300"
                  >
                    +1h Quick Log
                  </button>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={spentHours}
                  onChange={(e) => setSpentHours(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tags & Labels</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-sky-300 text-xs font-medium border border-slate-700"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter (e.g. Bug, Frontend)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
                >
                  Add Tag
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {canDelete && isEditing ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-500/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* History / Audit Log Tab */
          <div className="p-5 max-h-[calc(85vh-140px)] overflow-y-auto space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Card History & Audit Trail</h4>
            {cardLogs.length > 0 ? (
              <div className="space-y-2.5">
                {cardLogs.map(log => {
                  const logUser = users.find(u => u.id === log.userId);
                  return (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                      <img
                        src={logUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={logUser?.name || 'User'}
                        className="w-6 h-6 rounded-full object-cover mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-200">{logUser?.name || 'System'}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{log.details}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No activity recorded for this card yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

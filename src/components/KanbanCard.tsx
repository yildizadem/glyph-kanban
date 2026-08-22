import React from 'react';
import { TaskCard, User, Priority, Status } from '../types';
import { useBoard } from '../context/BoardContext';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Tag, 
  UserCheck, 
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { is_task_overdue } from '../generated/analytics';

interface KanbanCardProps {
  card: TaskCard;
  onEdit: (card: TaskCard) => void;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; bg: string; text: string; border: string; dot: string }> = {
  Urgent: { label: 'Urgent', bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', dot: 'bg-rose-400 animate-ping' },
  High: { label: 'High', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  Medium: { label: 'Medium', bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30', dot: 'bg-sky-400' },
  Low: { label: 'Low', bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', dot: 'bg-slate-400' },
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, onEdit }) => {
  const { users, currentUser, quickMoveCard, deleteCard, permissions } = useBoard();

  const reporter = users.find(u => u.id === card.reporterId);
  const assignee = users.find(u => u.id === card.assigneeId);

  const canEdit = permissions.canEdit(card);
  const canDelete = permissions.canDelete(card);
  const canMove = permissions.canMove(card);

  const dueMs = card.dueDate ? new Date(card.dueDate).getTime() : 0;
  const isOverdue = is_task_overdue(dueMs, Date.now(), card.status === 'Done');

  const priorityStyle = PRIORITY_CONFIG[card.priority] || PRIORITY_CONFIG.Medium;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete task "${card.title}"?`)) {
      deleteCard(card.id);
    }
  };

  const handleQuickMove = (e: React.MouseEvent, direction: 'next' | 'prev') => {
    e.stopPropagation();
    quickMoveCard(card.id, direction);
  };

  return (
    <div
      draggable={canMove}
      onDragStart={handleDragStart}
      onClick={() => onEdit(card)}
      className={`group relative bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-sm transition-all duration-200 cursor-pointer card-glow ${
        isOverdue ? 'ring-1 ring-rose-500/40' : ''
      }`}
    >
      {/* Top row: ID, Priority, and Quick Actions */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-sky-400 transition-colors">
            {card.id}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
            {card.priority}
          </span>
        </div>

        {/* Action icons on hover */}
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
          {canDelete && (
            <button
              onClick={handleDelete}
              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(card);
            }}
            className="p-1 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded transition-colors"
            title="Edit details"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Title */}
      <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-relaxed mb-2 group-hover:text-white">
        {card.title}
      </h4>

      {/* Description Snippet */}
      {card.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium border border-slate-700/60"
            >
              #{tag}
            </span>
          ))}
          {card.tags.length > 3 && (
            <span className="text-[10px] px-1 py-0.5 text-slate-500">
              +{card.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Time Tracking Progress */}
      {(card.estimatedHours > 0 || card.spentHours > 0) && (
        <div className="mb-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-400" />
              <span>Logged: <strong className="text-slate-200">{card.spentHours || 0}h</strong> / {card.estimatedHours || 0}h</span>
            </span>
            {card.estimatedHours > 0 && (
              <span className={card.spentHours > card.estimatedHours ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                {Math.round(((card.spentHours || 0) / card.estimatedHours) * 100)}%
              </span>
            )}
          </div>
          {card.estimatedHours > 0 && (
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  (card.spentHours || 0) > card.estimatedHours
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.round(((card.spentHours || 0) / card.estimatedHours) * 100))}%`
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Due date notice */}
      {card.dueDate && (
        <div className="flex items-center justify-between text-[10px] mb-3">
          <span className={`inline-flex items-center gap-1 font-medium ${
            isOverdue 
              ? 'text-rose-400 font-semibold' 
              : 'text-slate-400'
          }`}>
            {isOverdue ? <AlertCircle className="w-3 h-3 text-rose-400" /> : <Clock className="w-3 h-3" />}
            <span>Due {card.dueDate}</span>
          </span>
          {isOverdue && (
            <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-400 rounded text-[9px] font-bold border border-rose-500/30">
              OVERDUE
            </span>
          )}
        </div>
      )}

      {/* Footer: Reporter, Assignee avatars & Quick move controls */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {/* Users (Reporter & Assignee) */}
        <div className="flex items-center gap-3">
          {/* Assignee */}
          <div className="flex items-center gap-1.5" title={`Assignee: ${assignee?.name || 'Unassigned'}`}>
            {assignee ? (
              <img
                src={assignee.avatarUrl}
                alt={assignee.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-sky-500/40"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400">
                ?
              </div>
            )}
            <span className="text-[11px] font-medium text-slate-300 max-w-[70px] truncate">
              {assignee?.name ? assignee.name.split(' ')[0] : 'Unassigned'}
            </span>
          </div>

          {/* Reporter indicator */}
          {reporter && (
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500" title={`Reported by: ${reporter.name}`}>
              <span className="text-slate-600">by</span>
              <img
                src={reporter.avatarUrl}
                alt={reporter.name}
                className="w-4 h-4 rounded-full object-cover ring-1 ring-slate-700"
              />
            </div>
          )}
        </div>

        {/* Quick Move Arrows */}
        {canMove && (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {card.status !== 'Backlog' && (
              <button
                onClick={(e) => handleQuickMove(e, 'prev')}
                className="p-1 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                title="Move to previous column"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
            {card.status !== 'Done' && (
              <button
                onClick={(e) => handleQuickMove(e, 'next')}
                className="p-1 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-sky-400 transition-colors"
                title="Move to next column"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

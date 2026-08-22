import React, { useState } from 'react';
import { TaskCard, Status, Priority } from '../types';
import { KanbanCard } from './KanbanCard';
import { useBoard } from '../context/BoardContext';
import { 
  Inbox, 
  ListTodo, 
  PlayCircle, 
  Eye, 
  CheckCircle2, 
  Plus, 
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { get_priority_weight } from '../generated/board_engine';

interface KanbanColumnProps {
  status: Status;
  title: string;
  cards: TaskCard[];
  onEditCard: (card: TaskCard) => void;
  onQuickAdd: (status: Status) => void;
}

const COLUMN_CONFIG: Record<Status, { icon: React.ComponentType<{ className?: string }>; color: string; badgeBg: string; borderAccent: string }> = {
  Backlog: { icon: Inbox, color: 'text-slate-400', badgeBg: 'bg-slate-800 text-slate-300', borderAccent: 'hover:border-slate-700' },
  Todo: { icon: ListTodo, color: 'text-sky-400', badgeBg: 'bg-sky-500/20 text-sky-300', borderAccent: 'hover:border-sky-500/40' },
  InProgress: { icon: PlayCircle, color: 'text-amber-400', badgeBg: 'bg-amber-500/20 text-amber-300', borderAccent: 'hover:border-amber-500/40' },
  InReview: { icon: Eye, color: 'text-purple-400', badgeBg: 'bg-purple-500/20 text-purple-300', borderAccent: 'hover:border-purple-500/40' },
  Done: { icon: CheckCircle2, color: 'text-emerald-400', badgeBg: 'bg-emerald-500/20 text-emerald-300', borderAccent: 'hover:border-emerald-500/40' },
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  cards,
  onEditCard,
  onQuickAdd
}) => {
  const { moveCard, wipLimits, permissions } = useBoard();
  const [isDragOver, setIsDragOver] = useState(false);
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'default'>('default');

  const config = COLUMN_CONFIG[status];
  const Icon = config.icon;
  const limit = wipLimits[status] || 10;
  const isOverWip = cards.length > limit;

  // Sorting
  const sortedCards = [...cards].sort((a, b) => {
    if (sortBy === 'priority') {
      return get_priority_weight(b.priority) - get_priority_weight(a.priority);
    }
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      moveCard(cardId, status);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-w-[280px] max-w-[340px] bg-slate-950/70 border rounded-2xl transition-all duration-200 overflow-hidden ${
        isDragOver
          ? 'border-sky-500 bg-sky-950/20 ring-2 ring-sky-500/30'
          : isOverWip
          ? 'border-rose-800/80 bg-rose-950/10'
          : 'border-slate-800/80'
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.color}`} />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">{title}</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badgeBg}`}>
            {cards.length}
          </span>
        </div>

        {/* WIP Limit status indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              isOverWip
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold flex items-center gap-1'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title={`WIP Limit: ${limit}. Current: ${cards.length}`}
          >
            {isOverWip && <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />}
            WIP: {cards.length}/{limit}
          </span>

          {/* Quick Sort Toggle */}
          <button
            onClick={() => {
              const nextSort = sortBy === 'default' ? 'priority' : sortBy === 'priority' ? 'date' : 'default';
              setSortBy(nextSort);
            }}
            className={`p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ${
              sortBy !== 'default' ? 'text-sky-400 bg-sky-500/10' : ''
            }`}
            title={`Sort: ${sortBy} (Click to toggle)`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cards List Container */}
      <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto max-h-[calc(100vh-210px)] min-h-[300px]">
        {sortedCards.map(card => (
          <KanbanCard key={card.id} card={card} onEdit={onEditCard} />
        ))}

        {sortedCards.length === 0 && (
          <div className="h-32 border-2 border-dashed border-slate-800/60 rounded-xl flex flex-col items-center justify-center p-4 text-center">
            <p className="text-xs text-slate-500 font-medium">No tasks in {title}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Drag cards here or create new</p>
          </div>
        )}
      </div>

      {/* Column Footer: Quick Add Button */}
      {permissions.canCreate && (
        <div className="p-2 border-t border-slate-800/60 bg-slate-900/30">
          <button
            onClick={() => onQuickAdd(status)}
            className="w-full py-1.5 px-3 rounded-lg border border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      )}
    </div>
  );
};

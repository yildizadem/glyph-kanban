import React, { useState, useMemo } from 'react';
import { useBoard } from '../context/BoardContext';
import { KanbanColumn } from './KanbanColumn';
import { CardModal } from './CardModal';
import { TaskCard, Status, Priority } from '../types';
import { Filter, Tag, X, Sparkles } from 'lucide-react';

const COLUMNS: { id: Status; title: string }[] = [
  { id: 'Backlog', title: 'Backlog' },
  { id: 'Todo', title: 'To Do' },
  { id: 'InProgress', title: 'In Progress' },
  { id: 'InReview', title: 'In Review' },
  { id: 'Done', title: 'Completed' },
];

export const KanbanBoard: React.FC = () => {
  const { cards, filter, setFilter, resetFilters } = useBoard();
  
  const [selectedCard, setSelectedCard] = useState<TaskCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<Status>('Backlog');

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    cards.forEach(c => c.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  }, [cards]);

  // Filter cards
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // Search
      if (filter.search) {
        const query = filter.search.toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(query);
        const matchesDesc = (card.description || '').toLowerCase().includes(query);
        const matchesId = card.id.toLowerCase().includes(query);
        const matchesTag = card.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesId && !matchesTag) return false;
      }

      // Assignee
      if (filter.assigneeId && card.assigneeId !== filter.assigneeId) {
        return false;
      }

      // Reporter
      if (filter.reporterId && card.reporterId !== filter.reporterId) {
        return false;
      }

      // Priority
      if (filter.priority && card.priority !== filter.priority) {
        return false;
      }

      // Tag
      if (filter.tag && (!card.tags || !card.tags.includes(filter.tag))) {
        return false;
      }

      return true;
    });
  }, [cards, filter]);

  const handleEditCard = (card: TaskCard) => {
    setSelectedCard(card);
    setModalDefaultStatus(card.status);
    setIsModalOpen(true);
  };

  const handleQuickAdd = (status: Status) => {
    setSelectedCard(null);
    setModalDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const activeFiltersCount = 
    (filter.search ? 1 : 0) +
    (filter.assigneeId ? 1 : 0) +
    (filter.reporterId ? 1 : 0) +
    (filter.priority ? 1 : 0) +
    (filter.tag ? 1 : 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Filter Chips Bar */}
      <div className="px-4 lg:px-6 py-2.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium shrink-0">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <span>Filters:</span>
          </div>

          {/* Priority Quick Filter */}
          <select
            value={filter.priority}
            onChange={(e) => setFilter({ priority: e.target.value })}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Tag Quick Filter */}
          {allTags.length > 0 && (
            <select
              value={filter.tag}
              onChange={(e) => setFilter({ tag: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>#{tag}</option>
              ))}
            </select>
          )}

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear ({activeFiltersCount})</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block shrink-0">
          Showing <strong className="text-white">{filteredCards.length}</strong> of {cards.length} tasks
        </div>
      </div>

      {/* Columns Grid */}
      <div className="flex-1 p-4 lg:p-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max h-full">
          {COLUMNS.map(col => {
            const columnCards = filteredCards.filter(c => c.status === col.id);
            return (
              <KanbanColumn
                key={col.id}
                status={col.id}
                title={col.title}
                cards={columnCards}
                onEditCard={handleEditCard}
                onQuickAdd={handleQuickAdd}
              />
            );
          })}
        </div>
      </div>

      {/* Card Detail/Edit/Create Modal */}
      <CardModal
        isOpen={isModalOpen}
        card={selectedCard}
        defaultStatus={modalDefaultStatus}
        onClose={handleCloseModal}
      />
    </div>
  );
};

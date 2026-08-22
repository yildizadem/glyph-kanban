import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, TaskCard, ActivityLog, FilterState, Status, Priority, AssigneeAnalytics } from '../types';
import { INITIAL_USERS, INITIAL_CARDS, INITIAL_LOGS } from '../data/initialData';

// Import compiled Glyph functions
import {
  can_create_card,
  can_edit_card,
  can_delete_card,
  can_move_card_status,
  can_reassign_card,
  can_view_admin_metrics,
  is_admin,
  is_reporter,
  is_assignee
} from '../generated/permissions';

import {
  calculate_completion_rate,
  calculate_cycle_time_hours,
  calculate_lead_time_hours,
  detect_bottleneck_warning,
  compute_health_score,
  is_task_overdue
} from '../generated/analytics';

import {
  get_next_status,
  get_previous_status,
  get_priority_weight,
  format_activity_message
} from '../generated/board_engine';

interface BoardMetrics {
  totalCards: number;
  backlogCards: number;
  todoCards: number;
  inProgressCards: number;
  inReviewCards: number;
  completedCards: number;
  completionRate: number;
  avgCycleTimeHours: number;
  avgLeadTimeHours: number;
  totalEstimatedHours: number;
  totalSpentHours: number;
  overdueCount: number;
  bottleneckWarning: string;
  healthScore: number;
}

interface BoardContextType {
  cards: TaskCard[];
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  activeView: 'board' | 'admin';
  setActiveView: (view: 'board' | 'admin') => void;
  filter: FilterState;
  setFilter: (updater: Partial<FilterState> | ((prev: FilterState) => FilterState)) => void;
  resetFilters: () => void;
  logs: ActivityLog[];
  wipLimits: Record<Status, number>;
  setWipLimit: (status: Status, limit: number) => void;
  
  // Card Actions
  createCard: (card: Omit<TaskCard, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; message?: string };
  updateCard: (id: string, updates: Partial<TaskCard>) => { success: boolean; message?: string };
  deleteCard: (id: string) => { success: boolean; message?: string };
  moveCard: (id: string, targetStatus: Status) => { success: boolean; message?: string };
  quickMoveCard: (id: string, direction: 'next' | 'prev') => { success: boolean; message?: string };
  reassignCard: (id: string, newAssigneeId: string) => { success: boolean; message?: string };

  // RBAC Permission Helpers
  permissions: {
    canCreate: boolean;
    canViewMetrics: boolean;
    canEdit: (card: TaskCard) => boolean;
    canDelete: (card: TaskCard) => boolean;
    canMove: (card: TaskCard) => boolean;
    canReassign: () => boolean;
    isAdmin: boolean;
    isReporter: boolean;
    isAssignee: boolean;
  };

  // Analytics & Stats
  metrics: BoardMetrics;
  assigneeAnalytics: AssigneeAnalytics[];
  
  // Utilities
  exportData: () => string;
  importData: (jsonStr: string) => { success: boolean; error?: string };
  resetToDefaults: () => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

const STORAGE_KEY_CARDS = 'glyph_kanban_cards_v1';
const STORAGE_KEY_LOGS = 'glyph_kanban_logs_v1';
const STORAGE_KEY_USER = 'glyph_kanban_current_user_v1';
const STORAGE_KEY_WIP = 'glyph_kanban_wip_v1';

const DEFAULT_WIP: Record<Status, number> = {
  Backlog: 15,
  Todo: 8,
  InProgress: 4,
  InReview: 3,
  Done: 50
};

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = INITIAL_USERS.find(u => u.id === parsed.id);
        if (match) return match;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS[0]; // Admin by default
  });

  const [cards, setCards] = useState<TaskCard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CARDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CARDS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_LOGS;
  });

  const [wipLimits, setWipLimits] = useState<Record<Status, number>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WIP);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_WIP;
  });

  const [activeView, setActiveView] = useState<'board' | 'admin'>('board');

  const [filter, setFilterState] = useState<FilterState>({
    search: '',
    assigneeId: '',
    reporterId: '',
    priority: '',
    tag: ''
  });

  const setFilter = (updater: Partial<FilterState> | ((prev: FilterState) => FilterState)) => {
    setFilterState(prev => {
      if (typeof updater === 'function') {
        return updater(prev);
      }
      return { ...prev, ...updater };
    });
  };

  const resetFilters = () => {
    setFilterState({
      search: '',
      assigneeId: '',
      reporterId: '',
      priority: '',
      tag: ''
    });
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WIP, JSON.stringify(wipLimits));
  }, [wipLimits]);

  // Log an activity
  const addLog = (
    cardId: string,
    action: ActivityLog['action'],
    details: string,
    fromStatus?: string,
    toStatus?: string
  ) => {
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      cardId,
      userId: currentUser.id,
      action,
      fromStatus,
      toStatus,
      timestamp: new Date().toISOString(),
      details
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // RBAC Permission Helpers
  const permissions = useMemo(() => {
    const role = currentUser.role;
    return {
      canCreate: can_create_card(role),
      canViewMetrics: can_view_admin_metrics(role),
      canEdit: (card: TaskCard) => can_edit_card(role, card.reporterId, card.assigneeId, currentUser.id),
      canDelete: (card: TaskCard) => can_delete_card(role, card.reporterId, currentUser.id),
      canMove: (card: TaskCard) => can_move_card_status(role, card.reporterId, card.assigneeId, currentUser.id),
      canReassign: () => can_reassign_card(role),
      isAdmin: is_admin(role),
      isReporter: is_reporter(role),
      isAssignee: is_assignee(role)
    };
  }, [currentUser]);

  // Card Operations
  const createCard = (cardData: Omit<TaskCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!permissions.canCreate) {
      return { success: false, message: 'You do not have permission to create cards. Only Admins and Reporters can create tasks.' };
    }

    const now = new Date().toISOString();
    const newId = `TASK-${Math.floor(100 + Math.random() * 900)}`;
    const newCard: TaskCard = {
      ...cardData,
      id: newId,
      reporterId: cardData.reporterId || currentUser.id,
      createdAt: now,
      updatedAt: now,
      startedAt: cardData.status === 'InProgress' ? now : undefined,
      completedAt: cardData.status === 'Done' ? now : undefined
    };

    setCards(prev => [newCard, ...prev]);
    const message = format_activity_message(currentUser.name, 'create', newCard.title, 'created');
    addLog(newCard.id, 'create', message);

    return { success: true };
  };

  const updateCard = (id: string, updates: Partial<TaskCard>) => {
    const existing = cards.find(c => c.id === id);
    if (!existing) return { success: false, message: 'Card not found' };

    if (!permissions.canEdit(existing)) {
      return { success: false, message: 'You do not have permission to edit this card.' };
    }

    const now = new Date().toISOString();
    let updatedStartedAt = existing.startedAt;
    let updatedCompletedAt = existing.completedAt;

    if (updates.status && updates.status !== existing.status) {
      if (updates.status === 'InProgress' && !existing.startedAt) {
        updatedStartedAt = now;
      }
      if (updates.status === 'Done') {
        updatedCompletedAt = now;
      } else {
        updatedCompletedAt = undefined;
      }
    }

    const updatedCard: TaskCard = {
      ...existing,
      ...updates,
      startedAt: updatedStartedAt,
      completedAt: updatedCompletedAt,
      updatedAt: now
    };

    setCards(prev => prev.map(c => c.id === id ? updatedCard : c));
    const message = format_activity_message(currentUser.name, 'edit', existing.title, 'updated card properties');
    addLog(id, 'edit', message);

    return { success: true };
  };

  const deleteCard = (id: string) => {
    const existing = cards.find(c => c.id === id);
    if (!existing) return { success: false, message: 'Card not found' };

    if (!permissions.canDelete(existing)) {
      return { success: false, message: 'You do not have permission to delete this card.' };
    }

    setCards(prev => prev.filter(c => c.id !== id));
    const message = format_activity_message(currentUser.name, 'delete', existing.title, 'deleted');
    addLog(id, 'delete', message);

    return { success: true };
  };

  const moveCard = (id: string, targetStatus: Status) => {
    const existing = cards.find(c => c.id === id);
    if (!existing) return { success: false, message: 'Card not found' };

    if (!permissions.canMove(existing)) {
      return { success: false, message: 'Permission denied: Only Admins, the assigned engineer, or the reporting author can transition this card.' };
    }

    if (existing.status === targetStatus) return { success: true };

    const now = new Date().toISOString();
    const isMovingToInProgress = targetStatus === 'InProgress' && !existing.startedAt;
    const isMovingToDone = targetStatus === 'Done';

    const updatedCard: TaskCard = {
      ...existing,
      status: targetStatus,
      startedAt: isMovingToInProgress ? now : existing.startedAt,
      completedAt: isMovingToDone ? now : undefined,
      updatedAt: now
    };

    setCards(prev => prev.map(c => c.id === id ? updatedCard : c));
    const msg = format_activity_message(
      currentUser.name,
      'move',
      existing.title,
      `from ${existing.status} to ${targetStatus}`
    );
    addLog(id, 'move', msg, existing.status, targetStatus);

    return { success: true };
  };

  const quickMoveCard = (id: string, direction: 'next' | 'prev') => {
    const existing = cards.find(c => c.id === id);
    if (!existing) return { success: false, message: 'Card not found' };

    const targetStatus = direction === 'next'
      ? (get_next_status(existing.status) as Status)
      : (get_previous_status(existing.status) as Status);

    return moveCard(id, targetStatus);
  };

  const reassignCard = (id: string, newAssigneeId: string) => {
    const existing = cards.find(c => c.id === id);
    if (!existing) return { success: false, message: 'Card not found' };

    if (!permissions.canReassign()) {
      return { success: false, message: 'Only Admins and Reporters can reassign cards.' };
    }

    const assignee = users.find(u => u.id === newAssigneeId);
    const assigneeName = assignee ? assignee.name : 'Unassigned';

    const updatedCard: TaskCard = {
      ...existing,
      assigneeId: newAssigneeId,
      updatedAt: new Date().toISOString()
    };

    setCards(prev => prev.map(c => c.id === id ? updatedCard : c));
    const msg = format_activity_message(currentUser.name, 'reassign', existing.title, `reassigned to ${assigneeName}`);
    addLog(id, 'reassign', msg);

    return { success: true };
  };

  const setWipLimit = (status: Status, limit: number) => {
    if (!permissions.isAdmin) return;
    setWipLimits(prev => ({ ...prev, [status]: Math.max(1, limit) }));
  };

  // Metrics Calculation using Glyph Engine
  const metrics: BoardMetrics = useMemo(() => {
    const total = cards.length;
    const backlog = cards.filter(c => c.status === 'Backlog').length;
    const todo = cards.filter(c => c.status === 'Todo').length;
    const inProgress = cards.filter(c => c.status === 'InProgress').length;
    const inReview = cards.filter(c => c.status === 'InReview').length;
    const completed = cards.filter(c => c.status === 'Done').length;

    const rate = calculate_completion_rate(total, completed);

    // Compute cycle and lead times
    let totalCycleTime = 0;
    let cycleCount = 0;
    let totalLeadTime = 0;
    let leadCount = 0;
    let totalEstimated = 0;
    let totalSpent = 0;
    let overdueCount = 0;
    const nowMs = Date.now();

    cards.forEach(card => {
      totalEstimated += (card.estimatedHours || 0);
      totalSpent += (card.spentHours || 0);

      const dueMs = card.dueDate ? new Date(card.dueDate).getTime() : 0;
      if (is_task_overdue(dueMs, nowMs, card.status === 'Done')) {
        overdueCount++;
      }

      if (card.status === 'Done' && card.completedAt) {
        const completedMs = new Date(card.completedAt).getTime();
        const createdMs = new Date(card.createdAt).getTime();
        const lead = calculate_lead_time_hours(createdMs, completedMs);
        if (lead > 0) {
          totalLeadTime += lead;
          leadCount++;
        }

        if (card.startedAt) {
          const startedMs = new Date(card.startedAt).getTime();
          const cycle = calculate_cycle_time_hours(startedMs, completedMs);
          if (cycle > 0) {
            totalCycleTime += cycle;
            cycleCount++;
          }
        }
      }
    });

    const avgCycle = cycleCount > 0 ? Math.round((totalCycleTime / cycleCount) * 10) / 10 : 0;
    const avgLead = leadCount > 0 ? Math.round((totalLeadTime / leadCount) * 10) / 10 : 0;

    const bottleneckWarning = detect_bottleneck_warning(inProgress, inReview, wipLimits.InProgress);
    const isBottlenecked = inProgress > wipLimits.InProgress || inReview > wipLimits.InReview;
    const health = compute_health_score(rate, overdueCount, isBottlenecked);

    return {
      totalCards: total,
      backlogCards: backlog,
      todoCards: todo,
      inProgressCards: inProgress,
      inReviewCards: inReview,
      completedCards: completed,
      completionRate: rate,
      avgCycleTimeHours: avgCycle,
      avgLeadTimeHours: avgLead,
      totalEstimatedHours: totalEstimated,
      totalSpentHours: totalSpent,
      overdueCount,
      bottleneckWarning,
      healthScore: health
    };
  }, [cards, wipLimits]);

  // Assignee Breakdown Analytics
  const assigneeAnalytics: AssigneeAnalytics[] = useMemo(() => {
    return users.map(user => {
      const userCards = cards.filter(c => c.assigneeId === user.id);
      const assigned = userCards.length;
      const done = userCards.filter(c => c.status === 'Done').length;
      const inProg = userCards.filter(c => c.status === 'InProgress').length;
      const rev = userCards.filter(c => c.status === 'InReview').length;

      let est = 0;
      let spent = 0;
      userCards.forEach(c => {
        est += (c.estimatedHours || 0);
        spent += (c.spentHours || 0);
      });

      const rate = calculate_completion_rate(assigned, done);

      return {
        user,
        assignedCount: assigned,
        completedCount: done,
        inProgressCount: inProg,
        reviewCount: rev,
        totalEstimatedHours: est,
        totalSpentHours: spent,
        completionRate: rate
      };
    });
  }, [cards, users]);

  // Export / Import / Reset
  const exportData = () => {
    return JSON.stringify({ cards, logs, wipLimits, exportDate: new Date().toISOString() }, null, 2);
  };

  const importData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.cards)) {
        setCards(parsed.cards);
      }
      if (Array.isArray(parsed.logs)) {
        setLogs(parsed.logs);
      }
      if (parsed.wipLimits) {
        setWipLimits(parsed.wipLimits);
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Invalid JSON format' };
    }
  };

  const resetToDefaults = () => {
    setCards(INITIAL_CARDS);
    setLogs(INITIAL_LOGS);
    setWipLimits(DEFAULT_WIP);
    localStorage.removeItem(STORAGE_KEY_CARDS);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_WIP);
  };

  return (
    <BoardContext.Provider
      value={{
        cards,
        users,
        currentUser,
        setCurrentUser,
        activeView,
        setActiveView,
        filter,
        setFilter,
        resetFilters,
        logs,
        wipLimits,
        setWipLimit,
        createCard,
        updateCard,
        deleteCard,
        moveCard,
        quickMoveCard,
        reassignCard,
        permissions,
        metrics,
        assigneeAnalytics,
        exportData,
        importData,
        resetToDefaults
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};

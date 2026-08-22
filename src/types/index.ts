export type Role = 'Admin' | 'Reporter' | 'Assignee';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type Status = 'Backlog' | 'Todo' | 'InProgress' | 'InReview' | 'Done';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  title?: string;
}

export interface TaskCard {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  reporterId: string;
  assigneeId: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  dueDate: string;
  estimatedHours: number;
  spentHours: number;
  tags: string[];
}

export interface ActivityLog {
  id: string;
  cardId: string;
  userId: string;
  action: 'create' | 'move' | 'edit' | 'delete' | 'reassign';
  fromStatus?: string;
  toStatus?: string;
  timestamp: string;
  details: string;
}

export interface FilterState {
  search: string;
  assigneeId: string;
  reporterId: string;
  priority: string;
  tag: string;
}

export interface AssigneeAnalytics {
  user: User;
  assignedCount: number;
  completedCount: number;
  inProgressCount: number;
  reviewCount: number;
  totalEstimatedHours: number;
  totalSpentHours: number;
  completionRate: number;
}

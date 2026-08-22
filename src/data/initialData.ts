import { User, TaskCard, ActivityLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@glyphwork.io',
    role: 'Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Head of Engineering & Ops'
  },
  {
    id: 'user-reporter-1',
    name: 'Sarah Connor',
    email: 'sarah.c@glyphwork.io',
    role: 'Reporter',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Product Manager'
  },
  {
    id: 'user-reporter-2',
    name: 'David Kim',
    email: 'david.k@glyphwork.io',
    role: 'Reporter',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'QA & Compliance Lead'
  },
  {
    id: 'user-assignee-1',
    name: 'Elena Rostova',
    email: 'elena.r@glyphwork.io',
    role: 'Assignee',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Full-Stack Engineer'
  },
  {
    id: 'user-assignee-2',
    name: 'Marcus Vance',
    email: 'marcus.v@glyphwork.io',
    role: 'Assignee',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Frontend Specialist'
  },
  {
    id: 'user-assignee-3',
    name: 'Priya Patel',
    email: 'priya.p@glyphwork.io',
    role: 'Assignee',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Backend & Systems Architect'
  }
];

const now = Date.now();
const hour = 3600 * 1000;
const day = 24 * hour;

export const INITIAL_CARDS: TaskCard[] = [
  {
    id: 'TASK-101',
    title: 'Implement Glyph AST transpilation pipeline',
    description: 'Integrate the @glyphlang/glyph core compiler step to output clean, validated TypeScript modules for the UI runtime.',
    status: 'Done',
    priority: 'Urgent',
    reporterId: 'user-reporter-1',
    assigneeId: 'user-assignee-1',
    createdAt: new Date(now - 6 * day).toISOString(),
    updatedAt: new Date(now - 1 * day).toISOString(),
    startedAt: new Date(now - 5 * day).toISOString(),
    completedAt: new Date(now - 1 * day).toISOString(),
    dueDate: new Date(now - 2 * day).toISOString().split('T')[0],
    estimatedHours: 16,
    spentHours: 14,
    tags: ['Compiler', 'Glyph', 'Architecture']
  },
  {
    id: 'TASK-102',
    title: 'Set up real-time analytics aggregation engine',
    description: 'Calculate cycle time, lead time, throughput, and bottleneck alerts using strict Glyph functional pattern matching.',
    status: 'Done',
    priority: 'High',
    reporterId: 'user-reporter-1',
    assigneeId: 'user-assignee-3',
    createdAt: new Date(now - 5 * day).toISOString(),
    updatedAt: new Date(now - 1 * day).toISOString(),
    startedAt: new Date(now - 4 * day).toISOString(),
    completedAt: new Date(now - 1 * day).toISOString(),
    dueDate: new Date(now + 1 * day).toISOString().split('T')[0],
    estimatedHours: 12,
    spentHours: 11,
    tags: ['Analytics', 'Glyph', 'Engine']
  },
  {
    id: 'TASK-103',
    title: 'Design high-contrast Glassmorphic Kanban UI',
    description: 'Construct smooth drag-and-drop columns with responsive layout, WIP visual alerts, and role-based action toolbars.',
    status: 'InReview',
    priority: 'High',
    reporterId: 'user-reporter-1',
    assigneeId: 'user-assignee-2',
    createdAt: new Date(now - 4 * day).toISOString(),
    updatedAt: new Date(now - 4 * hour).toISOString(),
    startedAt: new Date(now - 3 * day).toISOString(),
    dueDate: new Date(now + 2 * day).toISOString().split('T')[0],
    estimatedHours: 18,
    spentHours: 16,
    tags: ['Frontend', 'UI/UX', 'Tailwind']
  },
  {
    id: 'TASK-104',
    title: 'Enforce RBAC permissions for Reporter vs Assignee',
    description: 'Ensure only Admins and designated Reporters can delete or reassign tasks, while Assignees can update task progress & status.',
    status: 'InProgress',
    priority: 'Urgent',
    reporterId: 'user-reporter-2',
    assigneeId: 'user-assignee-1',
    createdAt: new Date(now - 3 * day).toISOString(),
    updatedAt: new Date(now - 2 * hour).toISOString(),
    startedAt: new Date(now - 2 * day).toISOString(),
    dueDate: new Date(now + 1 * day).toISOString().split('T')[0],
    estimatedHours: 8,
    spentHours: 5,
    tags: ['Security', 'RBAC', 'Permissions']
  },
  {
    id: 'TASK-105',
    title: 'Add Admin workload & capacity distribution charts',
    description: 'Create multi-dimensional visual breakdown of assigned tasks, completion rates, and estimated vs logged hours per assignee.',
    status: 'InProgress',
    priority: 'Medium',
    reporterId: 'user-reporter-1',
    assigneeId: 'user-assignee-2',
    createdAt: new Date(now - 3 * day).toISOString(),
    updatedAt: new Date(now - 1 * hour).toISOString(),
    startedAt: new Date(now - 1 * day).toISOString(),
    dueDate: new Date(now + 3 * day).toISOString().split('T')[0],
    estimatedHours: 10,
    spentHours: 6,
    tags: ['Admin', 'Charts', 'Metrics']
  },
  {
    id: 'TASK-106',
    title: 'Audit trail logging for all card movements',
    description: 'Capture immutable history events on every status change, edit, or reassignment with timestamps and user identification.',
    status: 'Todo',
    priority: 'Medium',
    reporterId: 'user-reporter-2',
    assigneeId: 'user-assignee-3',
    createdAt: new Date(now - 2 * day).toISOString(),
    updatedAt: new Date(now - 1 * day).toISOString(),
    dueDate: new Date(now + 4 * day).toISOString().split('T')[0],
    estimatedHours: 6,
    spentHours: 0,
    tags: ['Audit', 'Compliance']
  },
  {
    id: 'TASK-107',
    title: 'Optimize state persistence with LocalStorage & JSON Export',
    description: 'Enable instant board export to JSON and import capabilities for backup and team handoffs.',
    status: 'Todo',
    priority: 'Low',
    reporterId: 'user-reporter-2',
    assigneeId: 'user-assignee-2',
    createdAt: new Date(now - 2 * day).toISOString(),
    updatedAt: new Date(now - 2 * day).toISOString(),
    dueDate: new Date(now + 5 * day).toISOString().split('T')[0],
    estimatedHours: 4,
    spentHours: 0,
    tags: ['Persistence', 'Export']
  },
  {
    id: 'TASK-108',
    title: 'Automated SLA breach notifications for aging tasks',
    description: 'Highlight cards that stay in Backlog or InProgress longer than the configured team SLA threshold.',
    status: 'Backlog',
    priority: 'Medium',
    reporterId: 'user-reporter-1',
    assigneeId: 'user-assignee-3',
    createdAt: new Date(now - 1 * day).toISOString(),
    updatedAt: new Date(now - 1 * day).toISOString(),
    dueDate: new Date(now + 7 * day).toISOString().split('T')[0],
    estimatedHours: 8,
    spentHours: 0,
    tags: ['SLA', 'Notifications', 'Admin']
  },
  {
    id: 'TASK-109',
    title: 'Webhook integration for GitHub / GitLab PR links',
    description: 'Auto-transition Kanban cards to InReview when an associated pull request is opened.',
    status: 'Backlog',
    priority: 'Low',
    reporterId: 'user-reporter-2',
    assigneeId: 'user-assignee-1',
    createdAt: new Date(now - 12 * hour).toISOString(),
    updatedAt: new Date(now - 12 * hour).toISOString(),
    dueDate: new Date(now + 10 * day).toISOString().split('T')[0],
    estimatedHours: 14,
    spentHours: 0,
    tags: ['Integration', 'GitHub']
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'LOG-1',
    cardId: 'TASK-101',
    userId: 'user-reporter-1',
    action: 'create',
    timestamp: new Date(now - 6 * day).toISOString(),
    details: 'Sarah Connor created card "Implement Glyph AST transpilation pipeline"'
  },
  {
    id: 'LOG-2',
    cardId: 'TASK-101',
    userId: 'user-assignee-1',
    action: 'move',
    fromStatus: 'InProgress',
    toStatus: 'Done',
    timestamp: new Date(now - 1 * day).toISOString(),
    details: 'Elena Rostova moved card from InProgress to Done'
  },
  {
    id: 'LOG-3',
    cardId: 'TASK-104',
    userId: 'user-reporter-2',
    action: 'create',
    timestamp: new Date(now - 3 * day).toISOString(),
    details: 'David Kim created card "Enforce RBAC permissions for Reporter vs Assignee"'
  },
  {
    id: 'LOG-4',
    cardId: 'TASK-104',
    userId: 'user-assignee-1',
    action: 'move',
    fromStatus: 'Todo',
    toStatus: 'InProgress',
    timestamp: new Date(now - 2 * day).toISOString(),
    details: 'Elena Rostova moved card from Todo to InProgress'
  }
];

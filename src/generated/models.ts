import "./.glyph-runtime/glyph-bootstrap";

import { schema as __glyph_schema } from "std/schema";

export type Role =
  | { tag: "Admin" }
  | { tag: "Reporter" }
  | { tag: "Assignee" };

export const Admin: Role = { tag: "Admin" };
export const Reporter: Role = { tag: "Reporter" };
export const Assignee: Role = { tag: "Assignee" };
export const Role = {
  is(value: unknown): value is Role {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    switch ((value as { tag?: unknown }).tag) {
      case "Admin": return true;
      case "Reporter": return true;
      case "Assignee": return true;
      default: return false;
    }
  },
  parse(value: unknown): { tag: "Ok"; value: Role } | { tag: "Err"; value: string } {
    return this.is(value)
      ? { tag: "Ok", value: value }
      : { tag: "Err", value: "expected Role" };
  },
  schema: __glyph_schema<Role>("Role", (v): v is Role => Role.is(v)),
};

export type Priority =
  | { tag: "Low" }
  | { tag: "Medium" }
  | { tag: "High" }
  | { tag: "Urgent" };

export const Low: Priority = { tag: "Low" };
export const Medium: Priority = { tag: "Medium" };
export const High: Priority = { tag: "High" };
export const Urgent: Priority = { tag: "Urgent" };
export const Priority = {
  is(value: unknown): value is Priority {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    switch ((value as { tag?: unknown }).tag) {
      case "Low": return true;
      case "Medium": return true;
      case "High": return true;
      case "Urgent": return true;
      default: return false;
    }
  },
  parse(value: unknown): { tag: "Ok"; value: Priority } | { tag: "Err"; value: string } {
    return this.is(value)
      ? { tag: "Ok", value: value }
      : { tag: "Err", value: "expected Priority" };
  },
  schema: __glyph_schema<Priority>("Priority", (v): v is Priority => Priority.is(v)),
};

export type Status =
  | { tag: "Backlog" }
  | { tag: "Todo" }
  | { tag: "InProgress" }
  | { tag: "InReview" }
  | { tag: "Done" };

export const Backlog: Status = { tag: "Backlog" };
export const Todo: Status = { tag: "Todo" };
export const InProgress: Status = { tag: "InProgress" };
export const InReview: Status = { tag: "InReview" };
export const Done: Status = { tag: "Done" };
export const Status = {
  is(value: unknown): value is Status {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    switch ((value as { tag?: unknown }).tag) {
      case "Backlog": return true;
      case "Todo": return true;
      case "InProgress": return true;
      case "InReview": return true;
      case "Done": return true;
      default: return false;
    }
  },
  parse(value: unknown): { tag: "Ok"; value: Status } | { tag: "Err"; value: string } {
    return this.is(value)
      ? { tag: "Ok", value: value }
      : { tag: "Err", value: "expected Status" };
  },
  schema: __glyph_schema<Status>("Status", (v): v is Status => Status.is(v)),
};

export type User = { id: string; name: string; email: string; role: string; avatarUrl: string };
export const User = {
  is(value: unknown): value is User {
    return typeof value === "object" && value !== null
      && typeof (value as Record<string, unknown>).id === "string"
      && typeof (value as Record<string, unknown>).name === "string"
      && typeof (value as Record<string, unknown>).email === "string"
      && typeof (value as Record<string, unknown>).role === "string"
      && typeof (value as Record<string, unknown>).avatarUrl === "string";
  },
  parse(value: unknown): { tag: "Ok"; value: User } | { tag: "Err"; value: string } {
    return this.is(value)
      ? { tag: "Ok", value: value }
      : { tag: "Err", value: "expected User" };
  },
  schema: __glyph_schema<User>("User", (v): v is User => User.is(v)),
};

export type TaskCard = { id: string; title: string; description: string; status: string; priority: string; reporterId: string; assigneeId: string; createdAt: string; updatedAt: string; startedAt: string; completedAt: string; dueDate: string; estimatedHours: number; spentHours: number; tags: Array<string> };
export const TaskCard = {
  is(value: unknown): value is TaskCard {
    return typeof value === "object" && value !== null
      && typeof (value as Record<string, unknown>).id === "string"
      && typeof (value as Record<string, unknown>).title === "string"
      && typeof (value as Record<string, unknown>).description === "string"
      && typeof (value as Record<string, unknown>).status === "string"
      && typeof (value as Record<string, unknown>).priority === "string"
      && typeof (value as Record<string, unknown>).reporterId === "string"
      && typeof (value as Record<string, unknown>).assigneeId === "string"
      && typeof (value as Record<string, unknown>).createdAt === "string"
      && typeof (value as Record<string, unknown>).updatedAt === "string"
      && typeof (value as Record<string, unknown>).startedAt === "string"
      && typeof (value as Record<string, unknown>).completedAt === "string"
      && typeof (value as Record<string, unknown>).dueDate === "string"
      && typeof (value as Record<string, unknown>).estimatedHours === "number"
      && typeof (value as Record<string, unknown>).spentHours === "number"
      && Array.isArray((value as Record<string, unknown>).tags) && ((value as Record<string, unknown>).tags as ReadonlyArray<unknown>).every((__e: unknown) => typeof __e === "string");
  },
  parse(value: unknown): { tag: "Ok"; value: TaskCard } | { tag: "Err"; value: string } {
    return this.is(value)
      ? { tag: "Ok", value: value }
      : { tag: "Err", value: "expected TaskCard" };
  },
  schema: __glyph_schema<TaskCard>("TaskCard", (v): v is TaskCard => TaskCard.is(v)),
};

export type ActivityLog = { id: string; cardId: string; userId: string; action: string; fromStatus: string; toStatus: string; timestamp: string; details: string };
export const ActivityLog = {
  is(value: unknown): value is ActivityLog {
    return typeof value === "object" && value !== null
      && typeof (value as Record<string, unknown>).id === "string"
      && typeof (value as Record<string, unknown>).cardId === "string"
      && typeof (value as Record<string, unknown>).userId === "string"
      && typeof (value as Record<string, unknown>).action === "string"
      && typeof (value as Record<string, unknown>).fromStatus === "string"
      && typeof (value as Record<string, unknown>).toStatus === "string"
      && typeof (value as Record<string, unknown>).timestamp === "string"
      && typeof (value as Record<string, unknown>).details === "string";
  },
  parse(value: unknown): { tag: "Ok"; value: ActivityLog } | { tag: "Err"; value: string } {
    return this.is(value)
      ? { tag: "Ok", value: value }
      : { tag: "Err", value: "expected ActivityLog" };
  },
  schema: __glyph_schema<ActivityLog>("ActivityLog", (v): v is ActivityLog => ActivityLog.is(v)),
};

export type AssigneeMetric = { assigneeId: string; assignedCount: number; completedCount: number; inProgressCount: number; totalEstimatedHours: number; totalSpentHours: number; completionRate: number };
export const AssigneeMetric = {
  is(value: unknown): value is AssigneeMetric {
    return typeof value === "object" && value !== null
      && typeof (value as Record<string, unknown>).assigneeId === "string"
      && typeof (value as Record<string, unknown>).assignedCount === "number"
      && typeof (value as Record<string, unknown>).completedCount === "number"
      && typeof (value as Record<string, unknown>).inProgressCount === "number"
      && typeof (value as Record<string, unknown>).totalEstimatedHours === "number"
      && typeof (value as Record<string, unknown>).totalSpentHours === "number"
      && typeof (value as Record<string, unknown>).completionRate === "number";
  },
  parse(value: unknown): { tag: "Ok"; value: AssigneeMetric } | { tag: "Err"; value: string } {
    return this.is(value)
      ? { tag: "Ok", value: value }
      : { tag: "Err", value: "expected AssigneeMetric" };
  },
  schema: __glyph_schema<AssigneeMetric>("AssigneeMetric", (v): v is AssigneeMetric => AssigneeMetric.is(v)),
};

export type SummaryMetrics = { totalCards: number; backlogCards: number; todoCards: number; inProgressCards: number; inReviewCards: number; completedCards: number; completionRate: number; avgCycleTimeHours: number; avgLeadTimeHours: number; totalEstimatedHours: number; totalSpentHours: number; overdueCount: number; bottleneckStatus: string; healthScore: number };
export const SummaryMetrics = {
  is(value: unknown): value is SummaryMetrics {
    return typeof value === "object" && value !== null
      && typeof (value as Record<string, unknown>).totalCards === "number"
      && typeof (value as Record<string, unknown>).backlogCards === "number"
      && typeof (value as Record<string, unknown>).todoCards === "number"
      && typeof (value as Record<string, unknown>).inProgressCards === "number"
      && typeof (value as Record<string, unknown>).inReviewCards === "number"
      && typeof (value as Record<string, unknown>).completedCards === "number"
      && typeof (value as Record<string, unknown>).completionRate === "number"
      && typeof (value as Record<string, unknown>).avgCycleTimeHours === "number"
      && typeof (value as Record<string, unknown>).avgLeadTimeHours === "number"
      && typeof (value as Record<string, unknown>).totalEstimatedHours === "number"
      && typeof (value as Record<string, unknown>).totalSpentHours === "number"
      && typeof (value as Record<string, unknown>).overdueCount === "number"
      && typeof (value as Record<string, unknown>).bottleneckStatus === "string"
      && typeof (value as Record<string, unknown>).healthScore === "number";
  },
  parse(value: unknown): { tag: "Ok"; value: SummaryMetrics } | { tag: "Err"; value: string } {
    return this.is(value)
      ? { tag: "Ok", value: value }
      : { tag: "Err", value: "expected SummaryMetrics" };
  },
  schema: __glyph_schema<SummaryMetrics>("SummaryMetrics", (v): v is SummaryMetrics => SummaryMetrics.is(v)),
};

export type Priority = 'low' | 'medium' | 'high' | 'none';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm (optional)
  tags: string[];
  status: TaskStatus;
  listId: string; // 'inbox' | custom list id
  subtasks: Subtask[];
  order: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomList {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: string;
}

export type DefaultViewId = 'inbox' | 'today' | 'upcoming' | 'completed';
export type SmartViewId = 'all' | 'overdue' | 'due-today' | 'next-7-days';
export type ActiveView = DefaultViewId | SmartViewId | string; // string is custom list id

export type SortField = 'order' | 'dueDate' | 'priority' | 'createdAt' | 'alphabetical';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  searchQuery: string;
  priority: Priority | 'all';
  tag: string | 'all';
  status: TaskStatus | 'all';
  smartView: SmartViewId;
  sortField: SortField;
  sortDirection: SortDirection;
}

export interface AppStats {
  completedTodayCount: number;
  lastCompletedDate: string; // YYYY-MM-DD
  currentStreak: number;
}

export interface StorageDataV1 {
  version: 1;
  tasks: Task[];
  lists: CustomList[];
  stats: AppStats;
  theme: 'light' | 'dark' | 'system';
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

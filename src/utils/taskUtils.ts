import { Task, Priority, FilterState, ActiveView } from '../types';
import { formatDateISO } from './naturalLanguageParser';

export const PRIORITY_WEIGHTS: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
};

export function formatDueDateDisplay(dateStr?: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
} {
  if (!dateStr) {
    return { label: '', isOverdue: false, isToday: false, isTomorrow: false };
  }

  const todayStr = formatDateISO(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDateISO(tomorrow);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateISO(yesterday);

  if (dateStr === todayStr) {
    return { label: 'Today', isOverdue: false, isToday: true, isTomorrow: false };
  }
  if (dateStr === tomorrowStr) {
    return { label: 'Tomorrow', isOverdue: false, isToday: false, isTomorrow: true };
  }
  if (dateStr === yesterdayStr) {
    return { label: 'Yesterday', isOverdue: true, isToday: false, isTomorrow: false };
  }

  if (dateStr < todayStr) {
    // Parse how many days overdue
    const diffTime = Math.abs(new Date(todayStr).getTime() - new Date(dateStr).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      label: `${diffDays}d overdue`,
      isOverdue: true,
      isToday: false,
      isTomorrow: false,
    };
  }

  // Future date
  const parsed = new Date(`${dateStr}T00:00:00`);
  const formatted = parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return { label: formatted, isOverdue: false, isToday: false, isTomorrow: false };
}

export function filterAndSortTasks(
  tasks: Task[],
  activeView: ActiveView,
  filters: FilterState
): Task[] {
  const todayStr = formatDateISO(new Date());
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const sevenDaysLaterStr = formatDateISO(sevenDaysLater);

  return tasks
    .filter((task) => {
      // 1. View filtering
      if (activeView === 'inbox') {
        if (task.listId !== 'inbox' && task.listId !== '') return false;
      } else if (activeView === 'today') {
        // Today view includes tasks due today OR overdue, excluding completed (unless requested)
        const isDueToday = task.dueDate === todayStr;
        const isOverdue = task.dueDate && task.dueDate < todayStr && task.status !== 'completed';
        if (!isDueToday && !isOverdue) return false;
      } else if (activeView === 'upcoming') {
        if (!task.dueDate || task.dueDate <= todayStr) return false;
      } else if (activeView === 'completed') {
        if (task.status !== 'completed') return false;
      } else if (activeView === 'overdue') {
        if (!task.dueDate || task.dueDate >= todayStr || task.status === 'completed') return false;
      } else if (activeView === 'due-today') {
        if (task.dueDate !== todayStr) return false;
      } else if (activeView === 'next-7-days') {
        if (!task.dueDate || task.dueDate < todayStr || task.dueDate > sevenDaysLaterStr) return false;
      } else if (activeView !== 'all') {
        // Custom list id
        if (task.listId !== activeView) return false;
      }

      // If activeView is not 'completed', generally don't hide completed unless filter says so,
      // but if the view is specifically completed, keep them.
      if (activeView !== 'completed' && filters.status === 'todo' && task.status === 'completed') {
        return false;
      }
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }

      // 2. Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // 3. Tag filter
      if (filters.tag !== 'all' && !task.tags.includes(filters.tag)) {
        return false;
      }

      // 4. Search Query filter (title, notes, tags)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesNotes = task.notes?.toLowerCase().includes(query) ?? false;
        const matchesTag = task.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesNotes && !matchesTag) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Sorting
      const dir = filters.sortDirection === 'asc' ? 1 : -1;

      switch (filters.sortField) {
        case 'dueDate': {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate) * dir;
        }
        case 'priority': {
          const weightA = PRIORITY_WEIGHTS[a.priority];
          const weightB = PRIORITY_WEIGHTS[b.priority];
          return (weightB - weightA) * dir;
        }
        case 'createdAt': {
          return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) * dir;
        }
        case 'alphabetical': {
          return a.title.localeCompare(b.title) * dir;
        }
        case 'order':
        default: {
          return (a.order - b.order) * dir;
        }
      }
    });
}

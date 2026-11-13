import { useState, useEffect, useCallback, useMemo } from 'react';
import { CustomList, Task, DefaultViewId, SmartViewId } from '../types';
import { storageService, INITIAL_LISTS } from '../lib/storage';
import { formatDateISO } from '../utils/naturalLanguageParser';

export function useLists() {
  const [lists, setLists] = useState<CustomList[]>(INITIAL_LISTS);

  useEffect(() => {
    const data = storageService.loadData();
    if (data.lists && data.lists.length > 0) {
      setLists(data.lists);
    }
  }, []);

  const createList = useCallback((name: string, color: string) => {
    if (!name.trim()) return null;
    const newList: CustomList = {
      id: `list-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      color: color || '#3B82F6',
      createdAt: new Date().toISOString(),
    };

    setLists((prev) => {
      const next = [...prev, newList];
      const data = storageService.loadData();
      storageService.saveData({ ...data, lists: next });
      return next;
    });

    return newList;
  }, []);

  const updateList = useCallback((id: string, updates: Partial<CustomList>) => {
    setLists((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, ...updates } : l));
      const data = storageService.loadData();
      storageService.saveData({ ...data, lists: next });
      return next;
    });
  }, []);

  const deleteList = useCallback((id: string) => {
    setLists((prev) => {
      const next = prev.filter((l) => l.id !== id);
      const data = storageService.loadData();
      storageService.saveData({ ...data, lists: next });
      return next;
    });
  }, []);

  const computeCounts = useCallback((tasks: Task[]) => {
    const todayStr = formatDateISO(new Date());
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    const sevenDaysLaterStr = formatDateISO(sevenDaysLater);

    const counts: Record<string, number> = {
      inbox: 0,
      today: 0,
      upcoming: 0,
      completed: 0,
      overdue: 0,
      'due-today': 0,
      'next-7-days': 0,
      all: 0,
    };

    // Initialize custom list counts
    lists.forEach((l) => {
      counts[l.id] = 0;
    });

    tasks.forEach((t) => {
      const isCompleted = t.status === 'completed';

      if (isCompleted) {
        counts.completed = (counts.completed || 0) + 1;
      } else {
        counts.all = (counts.all || 0) + 1;

        if (t.listId === 'inbox' || !t.listId) {
          counts.inbox = (counts.inbox || 0) + 1;
        }

        if (t.listId && counts[t.listId] !== undefined) {
          counts[t.listId] = (counts[t.listId] || 0) + 1;
        }

        if (t.dueDate) {
          if (t.dueDate === todayStr) {
            counts.today = (counts.today || 0) + 1;
            counts['due-today'] = (counts['due-today'] || 0) + 1;
          } else if (t.dueDate < todayStr) {
            // Overdue also counts toward today view urgency
            counts.today = (counts.today || 0) + 1;
            counts.overdue = (counts.overdue || 0) + 1;
          } else {
            counts.upcoming = (counts.upcoming || 0) + 1;
            if (t.dueDate <= sevenDaysLaterStr) {
              counts['next-7-days'] = (counts['next-7-days'] || 0) + 1;
            }
          }
        }
      }
    });

    return counts;
  }, [lists]);

  return {
    lists,
    createList,
    updateList,
    deleteList,
    computeCounts,
  };
}

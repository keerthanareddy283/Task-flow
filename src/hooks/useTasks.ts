import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, Subtask, ToastMessage, AppStats } from '../types';
import { storageService, INITIAL_DATA } from '../lib/storage';
import { formatDateISO } from '../utils/naturalLanguageParser';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<AppStats>(INITIAL_DATA.stats);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const isLoadedRef = useRef(false);

  // Undo stack
  const undoStackRef = useRef<{ action: string; restoreTasks: Task[]; restoreStats?: AppStats }[]>([]);

  // Load initial data
  useEffect(() => {
    const data = storageService.loadData();
    setTasks(data.tasks);
    setStats(data.stats);
    isLoadedRef.current = true;
  }, []);

  // Save changes to storage
  useEffect(() => {
    if (!isLoadedRef.current) return;
    const current = storageService.loadData();
    storageService.saveData({
      ...current,
      tasks,
      stats,
    });
  }, [tasks, stats]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev.slice(-3), newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration || 4500);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Recalculate streak and completed count
  const registerTaskCompletion = useCallback(() => {
    const todayStr = formatDateISO(new Date());
    setStats((prev) => {
      const isSameDay = prev.lastCompletedDate === todayStr;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatDateISO(yesterday);
      const isConsecutiveDay = prev.lastCompletedDate === yesterdayStr;

      let newStreak = prev.currentStreak;
      if (!isSameDay) {
        newStreak = isConsecutiveDay ? prev.currentStreak + 1 : 1;
      }

      return {
        completedTodayCount: isSameDay ? prev.completedTodayCount + 1 : 1,
        lastCompletedDate: todayStr,
        currentStreak: Math.max(1, newStreak),
      };
    });
  }, []);

  // Add Task
  const addTask = useCallback(
    (input: Partial<Task>): Task => {
      const now = new Date().toISOString();
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: input.title?.trim() || 'Untitled Task',
        notes: input.notes || '',
        priority: input.priority || 'none',
        dueDate: input.dueDate,
        dueTime: input.dueTime,
        tags: input.tags || [],
        status: input.status || 'todo',
        listId: input.listId || 'inbox',
        subtasks: input.subtasks || [],
        order: tasks.length,
        createdAt: now,
        updatedAt: now,
      };

      setTasks((prev) => [newTask, ...prev]);
      addToast({
        message: 'Task created',
        type: 'success',
        duration: 3000,
      });
      return newTask;
    },
    [tasks.length, addToast]
  );

  // Update Task
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  // Toggle Task Completion
  const toggleTaskComplete = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const target = prev.find((t) => t.id === id);
        if (!target) return prev;

        const willComplete = target.status !== 'completed';
        const snapshot = [...prev];

        if (willComplete) {
          registerTaskCompletion();
        }

        const nextTasks = prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: willComplete ? ('completed' as const) : ('todo' as const),
                completedAt: willComplete ? new Date().toISOString() : undefined,
                updatedAt: new Date().toISOString(),
              }
            : t
        );

        // Offer Undo
        addToast({
          message: willComplete ? 'Task completed' : 'Task marked active',
          type: 'info',
          action: {
            label: 'Undo',
            onClick: () => {
              setTasks(snapshot);
            },
          },
        });

        return nextTasks;
      });
    },
    [registerTaskCompletion, addToast]
  );

  // Delete Task
  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const target = prev.find((t) => t.id === id);
        if (!target) return prev;

        const snapshot = [...prev];
        const nextTasks = prev.filter((t) => t.id !== id);

        addToast({
          message: `Task deleted: "${target.title.slice(0, 24)}${target.title.length > 24 ? '...' : ''}"`,
          type: 'warning',
          action: {
            label: 'Undo',
            onClick: () => {
              setTasks(snapshot);
            },
          },
        });

        return nextTasks;
      });
    },
    [addToast]
  );

  // Reorder tasks for drag-and-drop
  const reorderTasks = useCallback((activeId: string, overId: string) => {
    if (activeId === overId) return;

    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === activeId);
      const newIndex = prev.findIndex((t) => t.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const updated = [...prev];
      const [movedItem] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, movedItem);

      return updated.map((t, idx) => ({ ...t, order: idx }));
    });
  }, []);

  // Bulk actions
  const bulkComplete = useCallback(
    (ids: string[]) => {
      if (!ids.length) return;
      setTasks((prev) => {
        const snapshot = [...prev];
        const nextTasks = prev.map((t) =>
          ids.includes(t.id)
            ? {
                ...t,
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : t
        );

        registerTaskCompletion();
        addToast({
          message: `${ids.length} task${ids.length > 1 ? 's' : ''} completed`,
          type: 'success',
          action: {
            label: 'Undo',
            onClick: () => setTasks(snapshot),
          },
        });

        return nextTasks;
      });
    },
    [registerTaskCompletion, addToast]
  );

  const bulkDelete = useCallback(
    (ids: string[]) => {
      if (!ids.length) return;
      setTasks((prev) => {
        const snapshot = [...prev];
        const nextTasks = prev.filter((t) => !ids.includes(t.id));

        addToast({
          message: `${ids.length} task${ids.length > 1 ? 's' : ''} deleted`,
          type: 'warning',
          action: {
            label: 'Undo',
            onClick: () => setTasks(snapshot),
          },
        });

        return nextTasks;
      });
    },
    [addToast]
  );

  const bulkMoveToList = useCallback(
    (ids: string[], targetListId: string) => {
      if (!ids.length) return;
      setTasks((prev) => {
        const snapshot = [...prev];
        const nextTasks = prev.map((t) =>
          ids.includes(t.id)
            ? {
                ...t,
                listId: targetListId,
                updatedAt: new Date().toISOString(),
              }
            : t
        );

        addToast({
          message: `Moved ${ids.length} task${ids.length > 1 ? 's' : ''}`,
          type: 'info',
          action: {
            label: 'Undo',
            onClick: () => setTasks(snapshot),
          },
        });

        return nextTasks;
      });
    },
    [addToast]
  );

  // Subtask management
  const addSubtask = useCallback((taskId: string, title: string) => {
    if (!title.trim()) return;
    const newSubtask: Subtask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: [...t.subtasks, newSubtask],
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.filter((st) => st.id !== subtaskId),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Clear or reset sample data
  const clearSampleData = useCallback(() => {
    const emptyData = storageService.clearSampleData();
    setTasks(emptyData.tasks);
    setStats(emptyData.stats);
    addToast({
      message: 'Sample data cleared',
      type: 'info',
    });
  }, [addToast]);

  const resetSampleData = useCallback(() => {
    const initial = storageService.resetToInitialSample();
    setTasks(initial.tasks);
    setStats(initial.stats);
    addToast({
      message: 'Reset to sample data',
      type: 'success',
    });
  }, [addToast]);

  const importData = useCallback(
    (jsonString: string) => {
      try {
        const imported = storageService.importJSON(jsonString);
        setTasks(imported.tasks);
        setStats(imported.stats);
        addToast({
          message: `Imported ${imported.tasks.length} tasks successfully`,
          type: 'success',
        });
      } catch (err: any) {
        addToast({
          message: err.message || 'Failed to import JSON file',
          type: 'error',
        });
      }
    },
    [addToast]
  );

  return {
    tasks,
    stats,
    toasts,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    reorderTasks,
    bulkComplete,
    bulkDelete,
    bulkMoveToList,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    clearSampleData,
    resetSampleData,
    importData,
    dismissToast,
    addToast,
  };
}

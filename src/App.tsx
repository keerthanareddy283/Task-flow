import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useTasks } from './hooks/useTasks';
import { useLists } from './hooks/useLists';
import { useFilters } from './hooks/useFilters';
import { useTheme } from './hooks/useTheme';
import { Task, ActiveView } from './types';
import { filterAndSortTasks } from './utils/taskUtils';
import { fireCelebrationConfetti } from './utils/confetti';
import { Sidebar } from './features/lists/Sidebar';
import { HeaderStats } from './features/stats/HeaderStats';
import { QuickAddBar } from './features/tasks/QuickAddBar';
import { TaskFilterBar } from './features/tasks/TaskFilterBar';
import { TaskList } from './features/tasks/TaskList';
import { TaskDetailSlideover } from './features/tasks/TaskDetailSlideover';
import { BulkActionsBar } from './features/tasks/BulkActionsBar';
import { CreateListModal } from './features/lists/CreateListModal';
import { CommandPalette } from './features/command/CommandPalette';
import { KeyboardShortcutsModal } from './features/command/KeyboardShortcutsModal';
import { ToastContainer } from './components/ui/Toast';

export default function App() {
  const { theme, setTheme } = useTheme();
  const {
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
  } = useTasks();

  const { lists, createList, deleteList, computeCounts } = useLists();

  const {
    activeView,
    setActiveView,
    searchInput,
    setSearchInput,
    priority,
    setPriority,
    tag,
    setTag,
    status,
    setStatus,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    filterState,
    resetFilters,
    hasActiveFilters,
  } = useFilters('inbox');

  // UI state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // References for keyboard autofocus
  const quickAddInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed counts for all lists and smart views
  const counts = useMemo(() => computeCounts(tasks), [computeCounts, tasks]);

  // Filtered and sorted tasks
  const visibleTasks = useMemo(() => {
    return filterAndSortTasks(tasks, activeView, filterState);
  }, [tasks, activeView, filterState]);

  // Keep selected task fresh if tasks state updates
  useEffect(() => {
    if (selectedTask) {
      const refreshed = tasks.find((t) => t.id === selectedTask.id);
      setSelectedTask(refreshed || null);
    }
  }, [tasks, selectedTask]);

  // Toggle selection for bulk actions
  const handleToggleSelectBulk = useCallback((id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  // Bulk actions handlers
  const handleBulkComplete = () => {
    bulkComplete(selectedTaskIds);
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    bulkDelete(selectedTaskIds);
    setSelectedTaskIds([]);
  };

  const handleBulkMove = (targetListId: string) => {
    bulkMoveToList(selectedTaskIds, targetListId);
    setSelectedTaskIds([]);
  };

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Cmd+K or Ctrl+K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Esc to close overlays or clear selection
      if (e.key === 'Escape') {
        if (selectedTaskIds.length > 0) {
          setSelectedTaskIds([]);
          return;
        }
        if (selectedTask) {
          setSelectedTask(null);
          return;
        }
        if (isCreateListOpen) {
          setIsCreateListOpen(false);
          return;
        }
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
          return;
        }
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        if (isMobileSidebarOpen) {
          setIsMobileSidebarOpen(false);
          return;
        }
      }

      // If typing in input, don't trigger single letter hotkeys
      if (isInput) return;

      // 'N' for new task
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        quickAddInputRef.current?.focus();
        return;
      }

      // '/' for search
      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // '?' for shortcuts modal
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
        return;
      }

      // Shift+D for toggle theme
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setTheme(theme === 'dark' ? 'light' : 'dark');
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    isCreateListOpen,
    isCommandPaletteOpen,
    isShortcutsOpen,
    isMobileSidebarOpen,
    selectedTask,
    selectedTaskIds.length,
    theme,
    setTheme,
  ]);

  // Export JSON file
  const handleExportData = () => {
    const currentData = {
      version: 1,
      tasks,
      lists,
      stats,
      theme,
    };
    const blob = new Blob([JSON.stringify(currentData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast({
      message: 'Tasks exported successfully',
      type: 'success',
    });
  };

  // Import JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Title for current view
  const currentViewTitle = useMemo(() => {
    if (tag !== 'all') {
      return `Tag: #${tag}`;
    }
    switch (activeView) {
      case 'inbox':
        return 'Inbox';
      case 'today':
        return 'Today';
      case 'upcoming':
        return 'Upcoming Schedule';
      case 'completed':
        return 'Completed Tasks';
      case 'overdue':
        return 'Overdue Tasks';
      case 'due-today':
        return 'Due Today';
      case 'next-7-days':
        return 'Next 7 Days';
      default: {
        const found = lists.find((l) => l.id === activeView);
        return found ? found.name : 'All Tasks';
      }
    }
  }, [activeView, tag, lists]);

  // Check if view has reached 100% completion milestone
  const handleCheckMilestone = useCallback(() => {
    if (visibleTasks.length > 0 && visibleTasks.every((t) => t.status === 'completed')) {
      fireCelebrationConfetti();
    }
  }, [visibleTasks]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* Hidden file input for importing JSON */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex-1 flex w-full">
        {/* Sidebar (Desktop persistent + Mobile drawer) */}
        <Sidebar
          activeView={activeView}
          onSelectView={(v) => {
            setActiveView(v);
            setSelectedTaskIds([]);
          }}
          lists={lists}
          onOpenCreateList={() => setIsCreateListOpen(true)}
          onDeleteList={(id) => {
            deleteList(id);
            if (activeView === id) setActiveView('inbox');
          }}
          counts={counts}
          tasks={tasks}
          selectedTag={tag}
          onSelectTag={(t) => {
            setTag(t);
            setSelectedTaskIds([]);
          }}
          onClearSampleData={clearSampleData}
          onResetSampleData={resetSampleData}
          onExportData={handleExportData}
          onImportClick={() => fileInputRef.current?.click()}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <HeaderStats
            stats={stats}
            theme={theme}
            onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            viewTitle={currentViewTitle}
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            searchInputRef={searchInputRef}
          />

          {/* Main Task List Area */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-4xl w-full mx-auto">
            {/* Natural Language Quick-Add Bar */}
            <QuickAddBar
              onAddTask={(input) => {
                const newTask = addTask(input);
                if (newTask.status === 'completed') {
                  handleCheckMilestone();
                }
              }}
              activeView={activeView}
              customLists={lists}
              inputRef={quickAddInputRef}
            />

            {/* Filter & Sort Controls */}
            <TaskFilterBar
              priority={priority}
              onPriorityChange={setPriority}
              status={status}
              onStatusChange={setStatus}
              sortField={sortField}
              onSortFieldChange={setSortField}
              sortDirection={sortDirection}
              onToggleSortDirection={() =>
                setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
              hasActiveFilters={hasActiveFilters}
              onClearFilters={resetFilters}
              totalVisible={visibleTasks.length}
            />

            {/* Tasks List */}
            <TaskList
              tasks={visibleTasks}
              onToggleComplete={(id) => {
                toggleTaskComplete(id);
                setTimeout(handleCheckMilestone, 250);
              }}
              onDelete={deleteTask}
              onSelectTask={setSelectedTask}
              onUpdateTitle={(id, title) => updateTask(id, { title })}
              onReorderTasks={reorderTasks}
              selectedTaskIds={selectedTaskIds}
              onToggleSelectBulk={handleToggleSelectBulk}
              customLists={lists}
              activeView={activeView}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={resetFilters}
              onOpenQuickAdd={() => quickAddInputRef.current?.focus()}
              isDragDisabled={sortField !== 'order' || hasActiveFilters}
            />
          </main>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedTaskIds.length}
        onCompleteSelected={handleBulkComplete}
        onDeleteSelected={handleBulkDelete}
        onMoveSelected={handleBulkMove}
        onClearSelection={() => setSelectedTaskIds([])}
        customLists={lists}
      />

      {/* Task Details Slide-Over (Bottom sheet on mobile) */}
      <TaskDetailSlideover
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onAddSubtask={addSubtask}
        onToggleSubtask={toggleSubtask}
        onDeleteSubtask={deleteSubtask}
        customLists={lists}
      />

      {/* Create List Modal */}
      <CreateListModal
        isOpen={isCreateListOpen}
        onClose={() => setIsCreateListOpen(false)}
        onCreateList={(name, color) => {
          const newList = createList(name, color);
          if (newList) {
            setActiveView(newList.id);
            addToast({ message: `Project "${newList.name}" created`, type: 'success' });
          }
        }}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectView={setActiveView}
        onOpenQuickAdd={() => quickAddInputRef.current?.focus()}
        onOpenCreateList={() => setIsCreateListOpen(true)}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onExportData={handleExportData}
        onTriggerConfetti={fireCelebrationConfetti}
        customLists={lists}
        currentTheme={theme}
      />

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Toast Notifications with Undo */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

# TaskFlow — Modern Task & Project Planner

TaskFlow is a production-grade, keyboard-first task management web application crafted with React, TypeScript, Tailwind CSS, Framer Motion, and `@dnd-kit`.

---

## 1. System Plan: Data Model & Component Tree

### Data Model
```typescript
type Priority = 'low' | 'medium' | 'high' | 'none';
type TaskStatus = 'todo' | 'in_progress' | 'completed';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string;
  tags: string[];
  status: TaskStatus;
  listId: string; // 'inbox' | customListId
  subtasks: Subtask[];
  order: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomList {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

interface AppStats {
  completedTodayCount: number;
  lastCompletedDate: string;
  currentStreak: number;
}
```

### Component Hierarchy
```text
App
├── Sidebar (Navigation, Smart views, Projects, Tag cloud, Import/Export)
├── HeaderStats (Brand, Live search, Done counter, Streak, Theme toggle, ⌘K)
├── Main Viewport
│   ├── QuickAddBar (Natural language parser + live token tags preview)
│   ├── TaskFilterBar (Status tabs, Priority filter, Sort menu, Count)
│   └── TaskList (DndContext + SortableContext)
│       └── TaskCard (Sortable, inline edit, checkbox, subtasks progress, metadata)
├── BulkActionsBar (Floating multi-select toolbar: Complete, Move, Delete)
├── TaskDetailSlideover (Full task inspector: checklist with progress bar, notes, tags)
├── CreateListModal (Color picker, name validation)
├── CommandPalette (⌘K / Ctrl+K quick actions, view navigation, search)
├── KeyboardShortcutsModal (? cheat sheet)
└── ToastContainer (Stackable alerts with one-click "Undo" action)
```

---

## 2. Features

- **Natural Language Quick-Add**:
  - Automatically parses due dates (`today`, `tomorrow`, `fri`, `in 3 days`, `dec 15`).
  - Automatically parses priority flags (`!high`, `!med`, `!low`, `!urgent`).
  - Automatically parses tags (`#work`, `#groceries`, `#health`).
  - Displays instant token badge previews while typing.
- **Fluid Drag-and-Drop Reordering**:
  - Built with `@dnd-kit/core` and `@dnd-kit/sortable`.
  - Full keyboard accessibility and pointer sensors.
- **Interactive Checklist (Subtasks)**:
  - Add, check, and delete subtasks per task.
  - Live progress bar indicator (`3/5 · 60%`).
- **Flexible Lists & Smart Views**:
  - Default views: *Inbox*, *Today*, *Upcoming*, *Completed*.
  - Smart filters: *Overdue*, *Due today*, *Next 7 days*.
  - Custom user lists with color-coded badges.
- **Search, Filter & Sort**:
  - Debounced instant search (matches titles, notes, and tags).
  - Priority and status filtering.
  - Sorting by manual order (drag & drop), due date, priority, creation date, or A-Z.
- **Bulk Operations**:
  - Select multiple tasks across views to complete, delete, or move in batch.
- **Undo Toast System**:
  - Non-blocking undo toasts for completion and deletion actions.
- **Keyboard Mastery**:
  - `N`: Quick-add new task.
  - `/`: Focus search bar.
  - `⌘K` / `Ctrl+K`: Global command palette.
  - `Esc`: Close open modal/slide-over or deselect.
  - `Shift+D`: Toggle dark & light mode.
  - `?`: Open keyboard shortcuts cheat sheet.
- **Celebratory Milestone**:
  - Confetti blast powered by `canvas-confetti` when completing all tasks in a view.
- **Data Portability & Resilience**:
  - JSON backup export and import.
  - Versioned schema (v1) with self-healing ID deduplication and corrupt data recovery.
  - "Clear sample data" and "Reset sample data" controls.

---

## 3. Project Structure

```text
src/
├── components/
│   └── ui/
│       ├── Badge.tsx           # Subtle status and priority badges
│       ├── Button.tsx          # Accessible buttons with size & color variants
│       ├── Checkbox.tsx        # Animated checkbox with motion
│       ├── EmptyState.tsx      # Contextual empty state illustrations
│       ├── Input.tsx           # Input with labels, icons, error states
│       ├── Modal.tsx           # Accessible dialog with backdrop blur & Escape
│       └── Toast.tsx           # Stackable toasts with action button
├── features/
│   ├── command/
│   │   ├── CommandPalette.tsx  # ⌘K Command palette modal
│   │   └── KeyboardShortcutsModal.tsx # Shortcuts cheatsheet modal
│   ├── lists/
│   │   ├── CreateListModal.tsx # New project list dialog
│   │   └── Sidebar.tsx         # Responsive sidebar & mobile drawer
│   ├── stats/
│   │   └── HeaderStats.tsx     # Streak counter and daily completion badge
│   └── tasks/
│       ├── BulkActionsBar.tsx  # Floating multi-select actions
│       ├── QuickAddBar.tsx     # Natural language task creation
│       ├── TaskCard.tsx        # Drag-and-drop task item with inline editing
│       ├── TaskDetailSlideover.tsx # Slideover sheet with subtask checklist
│       ├── TaskFilterBar.tsx   # Filter and sort toolbar
│       └── TaskList.tsx        # Dnd-kit sortable container
├── hooks/
│   ├── useFilters.ts           # Debounced search and filter state
│   ├── useLists.ts             # List management and view counters
│   ├── useTasks.ts             # Task CRUD, subtasks, bulk ops, undo stack
│   └── useTheme.ts             # Light/dark/system mode persistence
├── lib/
│   └── storage.ts              # Versioned localStorage abstraction layer
├── types/
│   └── index.ts                # TypeScript interfaces and domain types
├── utils/
│   ├── confetti.ts             # Canvas confetti launcher
│   ├── naturalLanguageParser.ts # Date, priority, and tag parsing
│   └── taskUtils.ts            # Pure filtering, sorting, and date helpers
├── App.tsx                     # Main layout and keyboard event dispatch
├── index.css                   # Tailwind v4 setup and dark variant
└── main.tsx                    # React DOM entry point
```

---

## 4. How to Swap localStorage for a Real API

The application isolates all storage operations inside `src/lib/storage.ts`:

1. **Replace Storage Calls**:
   Replace synchronous `storageService.loadData()` and `storageService.saveData()` with asynchronous API client methods (e.g., using `fetch` or `axios`):
   ```typescript
   export const apiService = {
     async getTasks(): Promise<Task[]> {
       const res = await fetch('/api/tasks');
       return res.json();
     },
     async createTask(task: Partial<Task>): Promise<Task> {
       const res = await fetch('/api/tasks', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(task),
       });
       return res.json();
     },
     async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
       const res = await fetch(`/api/tasks/${id}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(updates),
       });
       return res.json();
     },
     async deleteTask(id: string): Promise<void> {
       await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
     },
   };
   ```

2. **Integrate with React Query or SWR**:
   In `src/hooks/useTasks.ts`, replace local `useState` hooks with query and mutation hooks (`useQuery(['tasks'], apiService.getTasks)`) for optimistic updates, automatic cache revalidation, and background synchronization.

---

## 5. Next Ideas & Roadmap

- **User Accounts & Multi-tenant Workspaces**: Supabase / Firebase Auth integration with team sharing and collaborator assignments.
- **Browser Push & Calendar Reminders**: Notification API integration for overdue and upcoming task reminders.
- **Calendar & Timeline Gantt Views**: Switch between List, Kanban Board, and full Month Calendar views.
- **Offline Sync & Service Worker**: PWA integration with background sync via IndexedDB for uninterrupted offline productivity.

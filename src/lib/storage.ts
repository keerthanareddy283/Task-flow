import { StorageDataV1, Task, CustomList, AppStats } from '../types';
import { formatDateISO } from '../utils/naturalLanguageParser';

const STORAGE_KEY = 'taskflow_app_data_v1';

export function getRelativeDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatDateISO(d);
}

export const INITIAL_LISTS: CustomList[] = [
  {
    id: 'work',
    name: 'Work & Projects',
    color: '#3B82F6', // Blue
    createdAt: new Date().toISOString(),
  },
  {
    id: 'personal',
    name: 'Personal Life',
    color: '#10B981', // Emerald
    createdAt: new Date().toISOString(),
  },
  {
    id: 'finance',
    name: 'Finance & Admin',
    color: '#F59E0B', // Amber
    createdAt: new Date().toISOString(),
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    color: '#8B5CF6', // Purple
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finish Q4 strategic roadmap presentation for executive review',
    notes: 'Key sections to cover: retention metrics, cloud infrastructure budget forecast, and 2027 hiring plan. Ensure executive summary slides are crisp.',
    priority: 'high',
    dueDate: getRelativeDateString(0), // Today
    tags: ['strategy', 'roadmap', 'presentation'],
    status: 'in_progress',
    listId: 'work',
    subtasks: [
      { id: 'sub-1', title: 'Compile ARR & net retention telemetry', completed: true, createdAt: new Date().toISOString() },
      { id: 'sub-2', title: 'Draft cloud cost optimization slide', completed: true, createdAt: new Date().toISOString() },
      { id: 'sub-3', title: 'Schedule dry run with product leads', completed: false, createdAt: new Date().toISOString() },
      { id: 'sub-4', title: 'Export PDF speaker deck', completed: false, createdAt: new Date().toISOString() },
    ],
    order: 0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Book annual dental checkup & hygiene appointment',
    notes: 'Dr. Vance at Harbor Dental. Confirm if insurance renewal has cleared.',
    priority: 'medium',
    dueDate: getRelativeDateString(1), // Tomorrow
    tags: ['health', 'appointment'],
    status: 'todo',
    listId: 'health',
    subtasks: [
      { id: 'sub-5', title: 'Call clinic receptionist at 9:00 AM', completed: false, createdAt: new Date().toISOString() },
      { id: 'sub-6', title: 'Download latest dental claims summary', completed: false, createdAt: new Date().toISOString() },
    ],
    order: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Review pull request #482: Auth token rotation & rate limiter',
    notes: 'Check Redis sliding window algorithm and verify graceful fallback on connection timeouts.',
    priority: 'high',
    dueDate: getRelativeDateString(0), // Today
    tags: ['code-review', 'backend'],
    status: 'todo',
    listId: 'work',
    subtasks: [
      { id: 'sub-7', title: 'Inspect middleware unit test coverage', completed: true, createdAt: new Date().toISOString() },
      { id: 'sub-8', title: 'Run local load test script', completed: false, createdAt: new Date().toISOString() },
      { id: 'sub-9', title: 'Approve & sign off in GitHub', completed: false, createdAt: new Date().toISOString() },
    ],
    order: 2,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Grocery run: weekly meal prep ingredients',
    notes: 'Pick up wild salmon, baby spinach, Greek yogurt, organic walnuts, and sourdough loaf.',
    priority: 'low',
    dueDate: getRelativeDateString(2),
    tags: ['groceries', 'meal-prep'],
    status: 'todo',
    listId: 'personal',
    subtasks: [
      { id: 'sub-10', title: 'Wild salmon fillets (4x)', completed: false, createdAt: new Date().toISOString() },
      { id: 'sub-11', title: 'Fresh greens & olive oil', completed: false, createdAt: new Date().toISOString() },
      { id: 'sub-12', title: 'Whole roasted walnuts', completed: false, createdAt: new Date().toISOString() },
    ],
    order: 3,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Submit quarterly home insurance verification docs',
    notes: 'Upload policy endorsement page to mortgage servicer portal.',
    priority: 'medium',
    dueDate: getRelativeDateString(-1), // Overdue!
    tags: ['admin', 'documents'],
    status: 'todo',
    listId: 'finance',
    subtasks: [],
    order: 4,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    title: 'Morning 5km endurance run in the park',
    notes: 'Target pace: 5:15/km. Hydrate beforehand.',
    priority: 'low',
    dueDate: getRelativeDateString(0),
    tags: ['fitness', 'running'],
    status: 'completed',
    listId: 'health',
    subtasks: [],
    order: 5,
    completedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-7',
    title: 'Inspect cloud backup archives and verify checksums',
    notes: 'Run automated integrity check script on S3 Glacier snapshots.',
    priority: 'low',
    dueDate: getRelativeDateString(5),
    tags: ['devops', 'security'],
    status: 'todo',
    listId: 'inbox',
    subtasks: [],
    order: 6,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_STATS: AppStats = {
  completedTodayCount: 1,
  lastCompletedDate: formatDateISO(new Date()),
  currentStreak: 3,
};

export const INITIAL_DATA: StorageDataV1 = {
  version: 1,
  tasks: INITIAL_SAMPLE_TASKS,
  lists: INITIAL_LISTS,
  stats: INITIAL_STATS,
  theme: 'system',
};

/**
 * Storage Layer abstraction interface
 * Can be swapped for REST API or GraphQL client in production.
 */
export const storageService = {
  loadData(): StorageDataV1 {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        this.saveData(INITIAL_DATA);
        return INITIAL_DATA;
      }
      const parsed = JSON.parse(serialized);

      // Validate version
      if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) {
        console.warn('Storage schema version mismatch or invalid payload, initializing fresh storage.');
        this.saveData(INITIAL_DATA);
        return INITIAL_DATA;
      }

      // Ensure fields exist and tasks have valid unique IDs
      const tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
      const lists = Array.isArray(parsed.lists) ? parsed.lists : INITIAL_LISTS;
      const stats = parsed.stats && typeof parsed.stats === 'object' ? parsed.stats : INITIAL_STATS;
      const theme = ['light', 'dark', 'system'].includes(parsed.theme) ? parsed.theme : 'system';

      // Deduplicate task IDs if any corrupted
      const seenIds = new Set<string>();
      const sanitizedTasks: Task[] = [];
      for (const t of tasks) {
        if (!t || !t.id) continue;
        let id = t.id;
        while (seenIds.has(id)) {
          id = `${id}-${Math.random().toString(36).substring(2, 6)}`;
        }
        seenIds.add(id);
        sanitizedTasks.push({
          ...t,
          id,
          tags: Array.isArray(t.tags) ? t.tags : [],
          subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
          priority: ['low', 'medium', 'high', 'none'].includes(t.priority) ? t.priority : 'none',
          status: ['todo', 'in_progress', 'completed'].includes(t.status) ? t.status : 'todo',
        });
      }

      return {
        version: 1,
        tasks: sanitizedTasks,
        lists,
        stats,
        theme,
      };
    } catch (err) {
      console.error('Failed to load data from localStorage:', err);
      return INITIAL_DATA;
    }
  },

  saveData(data: StorageDataV1): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to persist data to localStorage:', err);
    }
  },

  clearSampleData(): StorageDataV1 {
    const emptyData: StorageDataV1 = {
      version: 1,
      tasks: [],
      lists: INITIAL_LISTS,
      stats: {
        completedTodayCount: 0,
        lastCompletedDate: formatDateISO(new Date()),
        currentStreak: 0,
      },
      theme: 'system',
    };
    this.saveData(emptyData);
    return emptyData;
  },

  resetToInitialSample(): StorageDataV1 {
    this.saveData(INITIAL_DATA);
    return INITIAL_DATA;
  },

  exportJSON(data: StorageDataV1): string {
    return JSON.stringify(data, null, 2);
  },

  importJSON(jsonString: string): StorageDataV1 {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON structure');
    }
    if (!Array.isArray(parsed.tasks)) {
      throw new Error('Missing "tasks" array in imported file');
    }

    const validatedData: StorageDataV1 = {
      version: 1,
      tasks: parsed.tasks.map((t: any, idx: number) => ({
        id: String(t.id || `task-${Date.now()}-${idx}`),
        title: String(t.title || 'Untitled task'),
        notes: t.notes ? String(t.notes) : '',
        priority: ['low', 'medium', 'high', 'none'].includes(t.priority) ? t.priority : 'none',
        dueDate: t.dueDate ? String(t.dueDate) : undefined,
        tags: Array.isArray(t.tags) ? t.tags.map(String) : [],
        status: ['todo', 'in_progress', 'completed'].includes(t.status) ? t.status : 'todo',
        listId: t.listId ? String(t.listId) : 'inbox',
        subtasks: Array.isArray(t.subtasks)
          ? t.subtasks.map((st: any, sIdx: number) => ({
              id: String(st.id || `sub-${Date.now()}-${sIdx}`),
              title: String(st.title || 'Subtask'),
              completed: Boolean(st.completed),
              createdAt: st.createdAt || new Date().toISOString(),
            }))
          : [],
        order: typeof t.order === 'number' ? t.order : idx,
        completedAt: t.completedAt ? String(t.completedAt) : undefined,
        createdAt: t.createdAt || new Date().toISOString(),
        updatedAt: t.updatedAt || new Date().toISOString(),
      })),
      lists: Array.isArray(parsed.lists) ? parsed.lists : INITIAL_LISTS,
      stats: parsed.stats || INITIAL_STATS,
      theme: parsed.theme || 'system',
    };

    this.saveData(validatedData);
    return validatedData;
  },
};

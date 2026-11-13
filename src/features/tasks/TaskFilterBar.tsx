import React from 'react';
import {
  ArrowDownUp,
  Filter,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Priority, TaskStatus, SortField, SortDirection } from '../../types';

export interface TaskFilterBarProps {
  priority: Priority | 'all';
  onPriorityChange: (p: Priority | 'all') => void;
  status: TaskStatus | 'all';
  onStatusChange: (s: TaskStatus | 'all') => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortDirection: SortDirection;
  onToggleSortDirection: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  totalVisible: number;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onToggleSortDirection,
  hasActiveFilters,
  onClearFilters,
  totalVisible,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 py-2 border-b border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
      {/* Left: Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status filter tabs */}
        <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => onStatusChange('all')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
              status === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onStatusChange('todo')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
              status === 'todo'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => onStatusChange('completed')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
              status === 'completed'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Done
          </button>
        </div>

        {/* Priority select */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-lg px-2 py-1">
          <span className="text-slate-400">Priority:</span>
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
            className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-white dark:bg-slate-900">
              All
            </option>
            <option value="high" className="bg-white dark:bg-slate-900">
              High
            </option>
            <option value="medium" className="bg-white dark:bg-slate-900">
              Medium
            </option>
            <option value="low" className="bg-white dark:bg-slate-900">
              Low
            </option>
          </select>
        </div>

        {/* Clear filter button if applied */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-2 py-1 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <X size={13} />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Right: Sort controls & visible task count */}
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
          {totalVisible} task{totalVisible === 1 ? '' : 's'}
        </span>

        {/* Sort field select */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-lg px-2 py-1">
          <ArrowDownUp size={13} className="text-slate-400" />
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
          >
            <option value="order" className="bg-white dark:bg-slate-900">
              Manual (Drag & Drop)
            </option>
            <option value="dueDate" className="bg-white dark:bg-slate-900">
              Due Date
            </option>
            <option value="priority" className="bg-white dark:bg-slate-900">
              Priority
            </option>
            <option value="createdAt" className="bg-white dark:bg-slate-900">
              Recently Created
            </option>
            <option value="alphabetical" className="bg-white dark:bg-slate-900">
              Alphabetical (A-Z)
            </option>
          </select>
        </div>

        {/* Sort direction toggle button */}
        <button
          onClick={onToggleSortDirection}
          title={`Order: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
          className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
        >
          <span className="text-xs font-mono font-bold">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        </button>
      </div>
    </div>
  );
};

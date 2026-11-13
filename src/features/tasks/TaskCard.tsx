import React, { useState, useRef, useEffect, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Calendar,
  CheckSquare,
  Trash2,
  Edit2,
  Check,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { Task, CustomList } from '../../types';
import { Checkbox } from '../../components/ui/Checkbox';
import { Badge, getPriorityBadge } from '../../components/ui/Badge';
import { formatDueDateDisplay } from '../../utils/taskUtils';

export interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  isSelectedForBulk: boolean;
  onToggleSelectBulk: (id: string) => void;
  customLists: CustomList[];
  isDragDisabled?: boolean;
}

export const TaskCard = memo<TaskCardProps>(({
  task,
  onToggleComplete,
  onDelete,
  onSelectTask,
  onUpdateTitle,
  isSelectedForBulk,
  onToggleSelectBulk,
  customLists,
  isDragDisabled = false,
}) => {
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [inlineTitle, setInlineTitle] = useState(task.title);
  const inlineInputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isDragDisabled || isEditingInline,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  useEffect(() => {
    setInlineTitle(task.title);
  }, [task.title]);

  useEffect(() => {
    if (isEditingInline) {
      inlineInputRef.current?.focus();
      inlineInputRef.current?.select();
    }
  }, [isEditingInline]);

  const handleSaveInline = () => {
    const trimmed = inlineTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdateTitle(task.id, trimmed);
    } else {
      setInlineTitle(task.title);
    }
    setIsEditingInline(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveInline();
    } else if (e.key === 'Escape') {
      setInlineTitle(task.title);
      setIsEditingInline(false);
    }
  };

  const isCompleted = task.status === 'completed';
  const completedSubtasksCount = task.subtasks.filter((st) => st.completed).length;
  const totalSubtasksCount = task.subtasks.length;
  const dueDateInfo = formatDueDateDisplay(task.dueDate);
  const parentList = customLists.find((l) => l.id === task.listId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-150 ${
        isDragging ? 'opacity-40 z-20 shadow-2xl scale-[1.02]' : 'opacity-100'
      } ${
        isSelectedForBulk
          ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700'
          : isCompleted
          ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Drag handle */}
      {!isDragDisabled && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder task"
          className="mt-1 -ml-1 p-0.5 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          <GripVertical size={16} />
        </button>
      )}

      {/* Bulk selection checkbox */}
      <div className="mt-1 flex items-center">
        <input
          type="checkbox"
          aria-label={`Select ${task.title} for bulk action`}
          checked={isSelectedForBulk}
          onChange={() => onToggleSelectBulk(task.id)}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </div>

      {/* Completion Checkbox */}
      <div className="mt-0.5">
        <Checkbox
          checked={isCompleted}
          onChange={() => onToggleComplete(task.id)}
          aria-label={`Mark "${task.title}" as ${isCompleted ? 'incomplete' : 'completed'}`}
        />
      </div>

      {/* Main Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          {isEditingInline ? (
            <div className="w-full flex items-center gap-2">
              <input
                ref={inlineInputRef}
                value={inlineTitle}
                onChange={(e) => setInlineTitle(e.target.value)}
                onBlur={handleSaveInline}
                onKeyDown={handleKeyDown}
                className="w-full text-sm font-medium py-1 px-2 border rounded-md border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
              <button
                onClick={handleSaveInline}
                className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => onSelectTask(task)}
              onDoubleClick={() => setIsEditingInline(true)}
              className="cursor-pointer select-none group/title"
            >
              <h4
                className={`text-sm font-medium leading-snug transition-colors ${
                  isCompleted
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-800 dark:text-slate-100 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400'
                }`}
              >
                {task.title}
              </h4>
            </div>
          )}

          {/* Quick Action Buttons (shown on card hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {!isEditingInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingInline(true);
                }}
                aria-label="Edit title inline"
                title="Edit title (or double-click title)"
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Edit2 size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              aria-label="Delete task"
              title="Delete task"
              className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Notes preview if present */}
        {task.notes && (
          <p
            onClick={() => onSelectTask(task)}
            className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 cursor-pointer"
          >
            {task.notes}
          </p>
        )}

        {/* Metadata Footer: Due date, Priority, Subtasks progress, Tags, List */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
          {/* Due date indicator */}
          {task.dueDate && (
            <div
              className={`inline-flex items-center gap-1 font-medium ${
                dueDateInfo.isOverdue && !isCompleted
                  ? 'text-rose-600 dark:text-rose-400 font-semibold'
                  : dueDateInfo.isToday && !isCompleted
                  ? 'text-amber-600 dark:text-amber-400 font-semibold'
                  : ''
              }`}
            >
              <Calendar size={12} />
              <span className="tabular-nums">{dueDateInfo.label}</span>
            </div>
          )}

          {/* Priority indicator */}
          {task.priority !== 'none' && (
            <div>{getPriorityBadge(task.priority)}</div>
          )}

          {/* Subtasks progress indicator */}
          {totalSubtasksCount > 0 && (
            <div
              onClick={() => onSelectTask(task)}
              className="inline-flex items-center gap-1 text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              title={`${completedSubtasksCount} of ${totalSubtasksCount} subtasks completed`}
            >
              <CheckSquare size={12} />
              <span>
                {completedSubtasksCount}/{totalSubtasksCount}
              </span>
            </div>
          )}

          {/* Project List Indicator */}
          {parentList && (
            <div className="inline-flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: parentList.color }}
              />
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                {parentList.name}
              </span>
            </div>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right chevron to open slide-over */}
      <button
        type="button"
        onClick={() => onSelectTask(task)}
        aria-label="Open task details"
        className="mt-1 p-1 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

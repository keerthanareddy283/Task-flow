import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Tag,
  Trash2,
  Folder,
  Plus,
  CheckCircle,
  Clock,
  Flag,
} from 'lucide-react';
import { Task, CustomList, Priority, TaskStatus } from '../../types';
import { Checkbox } from '../../components/ui/Checkbox';
import { formatDateISO } from '../../utils/naturalLanguageParser';

export interface TaskDetailSlideoverProps {
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  customLists: CustomList[];
}

export const TaskDetailSlideover: React.FC<TaskDetailSlideoverProps> = ({
  task,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  customLists,
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNotes(task.notes || '');
    }
  }, [task]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && task) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [task, onClose]);

  if (!task) return null;

  const handleTitleBlur = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdateTask(task.id, { title: trimmed });
    } else {
      setTitle(task.title);
    }
  };

  const handleNotesBlur = () => {
    if (notes !== (task.notes || '')) {
      onUpdateTask(task.id, { notes });
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cleanTag = newTagInput.trim().toLowerCase().replace(/^#/, '');
      if (cleanTag && !task.tags.includes(cleanTag)) {
        onUpdateTask(task.id, { tags: [...task.tags, cleanTag] });
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTask(task.id, {
      tags: task.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const setDueDatePreset = (daysAhead: number | null) => {
    if (daysAhead === null) {
      onUpdateTask(task.id, { dueDate: undefined });
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    onUpdateTask(task.id, { dueDate: formatDateISO(d) });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
        />

        {/* Slide-over Container (Bottom sheet on mobile, right drawer on desktop) */}
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full sm:w-[480px] md:w-[520px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col justify-between overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Task Details
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onDeleteTask(task.id);
                  onClose();
                }}
                aria-label="Delete task"
                title="Delete task"
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close slideover"
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Title
              </label>
              <textarea
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                className="w-full text-base font-semibold leading-relaxed bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Quick Properties Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
              {/* List / Project selector */}
              <div>
                <label className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  <Folder size={13} />
                  <span>List / Project</span>
                </label>
                <select
                  value={task.listId}
                  onChange={(e) => onUpdateTask(task.id, { listId: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="inbox">📥 Inbox</option>
                  {customLists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority selector */}
              <div>
                <label className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  <Flag size={13} />
                  <span>Priority</span>
                </label>
                <select
                  value={task.priority}
                  onChange={(e) => onUpdateTask(task.id, { priority: e.target.value as Priority })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (!urgent)</option>
                </select>
              </div>

              {/* Due Date & Presets */}
              <div className="col-span-2">
                <label className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  <Calendar size={13} />
                  <span>Due Date</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={task.dueDate || ''}
                    onChange={(e) => onUpdateTask(task.id, { dueDate: e.target.value || undefined })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {task.dueDate && (
                    <button
                      type="button"
                      onClick={() => setDueDatePreset(null)}
                      className="px-2.5 py-2 text-xs text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {/* Presets */}
                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setDueDatePreset(0)}
                    className="px-2 py-0.5 text-[11px] rounded bg-slate-200/60 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDueDatePreset(1)}
                    className="px-2 py-0.5 text-[11px] rounded bg-slate-200/60 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setDueDatePreset(7)}
                    className="px-2 py-0.5 text-[11px] rounded bg-slate-200/60 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                  >
                    Next Week
                  </button>
                </div>
              </div>
            </div>

            {/* Subtasks Section with Checklist & Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle size={14} className="text-blue-500" />
                  <span>Subtasks</span>
                </label>
                {totalSubtasks > 0 && (
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {completedSubtasks}/{totalSubtasks} ({subtaskPercent}%)
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {totalSubtasks > 0 && (
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${subtaskPercent}%` }}
                  />
                </div>
              )}

              {/* Subtasks List */}
              <div className="space-y-1.5">
                {task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="group flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Checkbox
                        size="sm"
                        checked={st.completed}
                        onChange={() => onToggleSubtask(task.id, st.id)}
                      />
                      <span
                        className={`text-xs ${
                          st.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteSubtask(task.id, st.id)}
                      aria-label="Delete subtask"
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-opacity"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add subtask input */}
              <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add a subtask (press Enter)"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newSubtaskTitle.trim()}
                  className="px-2.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </form>
            </div>

            {/* Notes Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Notes & Context
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Add background notes, links, or details..."
                className="w-full text-xs leading-relaxed bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tags Management */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Tag size={13} className="text-slate-400" />
                <span>Tags</span>
              </label>

              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/50"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-500 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag name and press Enter"
                className="w-full text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer Timestamps */}
          <div className="px-6 py-3 bg-slate-50/80 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
            {task.updatedAt && (
              <span>Updated {new Date(task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};

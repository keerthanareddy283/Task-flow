import React, { useState, useRef, useEffect } from 'react';
import { Plus, Calendar, Tag, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { parseNaturalLanguage } from '../../utils/naturalLanguageParser';
import { Task, CustomList } from '../../types';
import { Badge, getPriorityBadge } from '../../components/ui/Badge';
import { formatDueDateDisplay } from '../../utils/taskUtils';

export interface QuickAddBarProps {
  onAddTask: (input: Partial<Task>) => void;
  activeView: string;
  customLists: CustomList[];
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({
  onAddTask,
  activeView,
  customLists,
  inputRef,
}) => {
  const [value, setValue] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);
  const targetRef = inputRef || internalRef;

  const parsed = parseNaturalLanguage(value);
  const hasParsedAttributes =
    parsed.priority !== 'none' || Boolean(parsed.dueDate) || parsed.tags.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsed.cleanTitle) return;

    // Determine target list: if active view is a custom list or 'inbox', use that; else default to inbox
    let listId = 'inbox';
    if (customLists.some((l) => l.id === activeView)) {
      listId = activeView;
    }

    onAddTask({
      title: parsed.cleanTitle,
      priority: parsed.priority,
      dueDate: parsed.dueDate,
      tags: parsed.tags,
      listId,
      status: 'todo',
    });

    setValue('');
  };

  const dueDateInfo = parsed.dueDate ? formatDueDateDisplay(parsed.dueDate) : null;

  return (
    <div className="relative w-full mb-6">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-all overflow-hidden"
      >
        <div className="flex items-center px-3 py-2 sm:px-4 sm:py-2.5 gap-2.5">
          <div className="text-slate-400 dark:text-slate-500 shrink-0">
            <Plus size={18} />
          </div>
          <input
            ref={targetRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Quick add: 'Send proposal tomorrow !high #client' (Press Enter to save)"
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setShowHelp((prev) => !prev)}
              title="Natural language syntax hints"
              aria-label="Syntax hints"
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <HelpCircle size={15} />
            </button>
            <button
              type="submit"
              disabled={!parsed.cleanTitle}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              Add
            </button>
          </div>
        </div>

        {/* Live Natural Language Parsing Preview Bar */}
        {value.trim() && hasParsedAttributes && (
          <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 sm:px-4 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <Sparkles size={11} className="text-blue-500" />
              <span>Parsed:</span>
            </div>

            {parsed.dueDate && dueDateInfo && (
              <span className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded text-[11px]">
                <Calendar size={11} />
                <span>{dueDateInfo.label} ({parsed.dueDate})</span>
              </span>
            )}

            {parsed.priority !== 'none' && (
              <div>{getPriorityBadge(parsed.priority)}</div>
            )}

            {parsed.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"
              >
                <Tag size={10} />
                <span>#{tag}</span>
              </span>
            ))}
          </div>
        )}
      </form>

      {/* Syntax helper popover */}
      {showHelp && (
        <div className="absolute top-full left-0 mt-2 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-3 z-30 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100 pb-1 border-b border-slate-100 dark:border-slate-800">
            <span>Natural Language Shortcuts</span>
            <button
              onClick={() => setShowHelp(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">Dates</p>
              <p className="text-slate-500 dark:text-slate-400">
                <code className="text-blue-600 dark:text-blue-400">today</code>,{' '}
                <code className="text-blue-600 dark:text-blue-400">tomorrow</code>,{' '}
                <code className="text-blue-600 dark:text-blue-400">fri</code>,{' '}
                <code className="text-blue-600 dark:text-blue-400">in 3 days</code>
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">Priority</p>
              <p className="text-slate-500 dark:text-slate-400">
                <code className="text-rose-600 dark:text-rose-400">!high</code>,{' '}
                <code className="text-amber-600 dark:text-amber-400">!med</code>,{' '}
                <code className="text-slate-600 dark:text-slate-400">!low</code>
              </p>
            </div>
            <div className="col-span-2">
              <p className="font-medium text-slate-800 dark:text-slate-200">Tags</p>
              <p className="text-slate-500 dark:text-slate-400">
                Use hash prefix: <code className="text-blue-600 dark:text-blue-400">#work</code>,{' '}
                <code className="text-blue-600 dark:text-blue-400">#health</code>,{' '}
                <code className="text-blue-600 dark:text-blue-400">#errands</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

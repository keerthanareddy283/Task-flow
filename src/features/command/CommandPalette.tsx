import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Moon,
  Sun,
  Inbox,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Download,
  FolderPlus,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CustomList, ActiveView } from '../../types';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ActiveView) => void;
  onOpenQuickAdd: () => void;
  onOpenCreateList: () => void;
  onToggleTheme: () => void;
  onExportData: () => void;
  onTriggerConfetti: () => void;
  customLists: CustomList[];
  currentTheme: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onOpenQuickAdd,
  onOpenCreateList,
  onToggleTheme,
  onExportData,
  onTriggerConfetti,
  customLists,
  currentTheme,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Command items
  const allCommands = [
    {
      id: 'new-task',
      title: 'Create new task',
      category: 'Actions',
      icon: <Plus size={16} className="text-blue-500" />,
      action: () => {
        onClose();
        onOpenQuickAdd();
      },
    },
    {
      id: 'new-list',
      title: 'Create new project list',
      category: 'Actions',
      icon: <FolderPlus size={16} className="text-emerald-500" />,
      action: () => {
        onClose();
        onOpenCreateList();
      },
    },
    {
      id: 'view-inbox',
      title: 'Go to Inbox',
      category: 'Navigation',
      icon: <Inbox size={16} className="text-slate-400" />,
      action: () => {
        onSelectView('inbox');
        onClose();
      },
    },
    {
      id: 'view-today',
      title: 'Go to Today',
      category: 'Navigation',
      icon: <Calendar size={16} className="text-amber-500" />,
      action: () => {
        onSelectView('today');
        onClose();
      },
    },
    {
      id: 'view-upcoming',
      title: 'Go to Upcoming',
      category: 'Navigation',
      icon: <Calendar size={16} className="text-blue-400" />,
      action: () => {
        onSelectView('upcoming');
        onClose();
      },
    },
    {
      id: 'view-overdue',
      title: 'Go to Overdue tasks',
      category: 'Navigation',
      icon: <AlertTriangle size={16} className="text-rose-500" />,
      action: () => {
        onSelectView('overdue');
        onClose();
      },
    },
    {
      id: 'view-completed',
      title: 'Go to Completed',
      category: 'Navigation',
      icon: <CheckCircle size={16} className="text-emerald-500" />,
      action: () => {
        onSelectView('completed');
        onClose();
      },
    },
    // Custom lists
    ...customLists.map((l) => ({
      id: `list-${l.id}`,
      title: `Go to ${l.name}`,
      category: 'Projects',
      icon: (
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0"
          style={{ backgroundColor: l.color }}
        />
      ),
      action: () => {
        onSelectView(l.id);
        onClose();
      },
    })),
    {
      id: 'toggle-theme',
      title: `Toggle Theme (Current: ${currentTheme})`,
      category: 'Preferences',
      icon: currentTheme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-blue-400" />,
      action: () => {
        onToggleTheme();
        onClose();
      },
    },
    {
      id: 'export-data',
      title: 'Export all tasks (JSON)',
      category: 'Data',
      icon: <Download size={16} className="text-purple-400" />,
      action: () => {
        onExportData();
        onClose();
      },
    },
    {
      id: 'confetti',
      title: 'Celebrate productivity! 🎉',
      category: 'Fun',
      icon: <Sparkles size={16} className="text-yellow-400" />,
      action: () => {
        onTriggerConfetti();
        onClose();
      },
    },
  ];

  const filteredCommands = allCommands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Palette Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-10 overflow-hidden"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-800">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search... (↑↓ to navigate, Enter to select)"
              className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-0.5">
            {filteredCommands.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                No matching commands found
              </div>
            ) : (
              filteredCommands.map((command, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={command.id}
                    onClick={command.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={isSelected ? 'text-white' : ''}>{command.icon}</span>
                      <span className="truncate">{command.title}</span>
                    </div>
                    <span
                      className={`text-[11px] font-mono uppercase tracking-wider shrink-0 ${
                        isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {command.category}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

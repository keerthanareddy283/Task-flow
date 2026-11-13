import React from 'react';
import { Modal } from '../../components/ui/Modal';

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const shortcuts = [
    { key: 'N', description: 'Create a new task in current view' },
    { key: '/', description: 'Focus search input' },
    { key: '⌘ + K / Ctrl + K', description: 'Open command palette' },
    { key: 'Esc', description: 'Close slide-over, dialogs, or clear selection' },
    { key: 'Enter', description: 'Save task, inline edit, or add subtask' },
    { key: 'Shift + D', description: 'Toggle dark & light mode' },
    { key: '?', description: 'Open keyboard shortcuts cheat sheet' },
  ];

  const naturalSyntax = [
    { syntax: 'tomorrow / fri / in 3 days', description: 'Sets task due date automatically' },
    { syntax: '!high / !urgent / !med / !low', description: 'Sets priority level' },
    { syntax: '#work / #groceries / #health', description: 'Attaches tags to task' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts & Syntax"
      description="Power through your tasks with seamless keyboard navigation."
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Navigation & Actions
          </h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {shortcuts.map((s) => (
              <div key={s.key} className="flex items-center justify-between py-2 text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {s.description}
                </span>
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-[11px] shadow-2xs">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Natural Language Quick-Add Syntax
          </h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {naturalSyntax.map((item) => (
              <div key={item.syntax} className="flex items-center justify-between py-2 text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {item.description}
                </span>
                <code className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">
                  {item.syntax}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

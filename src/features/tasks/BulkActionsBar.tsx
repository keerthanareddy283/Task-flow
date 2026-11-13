import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Trash2, FolderInput, X } from 'lucide-react';
import { CustomList } from '../../types';

export interface BulkActionsBarProps {
  selectedCount: number;
  onCompleteSelected: () => void;
  onDeleteSelected: () => void;
  onMoveSelected: (targetListId: string) => void;
  onClearSelection: () => void;
  customLists: CustomList[];
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onCompleteSelected,
  onDeleteSelected,
  onMoveSelected,
  onClearSelection,
  customLists,
}) => {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3 px-4 py-2.5 bg-slate-900 text-slate-100 dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-700/80 text-xs sm:text-sm font-medium"
      >
        <div className="flex items-center gap-2 border-r border-slate-700 pr-3 mr-1">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-mono tabular-nums">
            {selectedCount}
          </span>
          <span className="hidden sm:inline text-slate-300">selected</span>
        </div>

        {/* Complete */}
        <button
          onClick={onCompleteSelected}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <CheckCircle2 size={15} />
          <span>Complete</span>
        </button>

        {/* Move to List */}
        <div className="relative group">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer">
            <FolderInput size={15} />
            <select
              aria-label="Move selected tasks to list"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onMoveSelected(e.target.value);
                  e.target.value = '';
                }
              }}
              className="bg-transparent text-slate-300 hover:text-white focus:outline-none cursor-pointer pr-1"
            >
              <option value="" disabled className="text-slate-900 bg-white">
                Move to...
              </option>
              <option value="inbox" className="text-slate-900 bg-white">
                📥 Inbox
              </option>
              {customLists.map((l) => (
                <option key={l.id} value={l.id} className="text-slate-900 bg-white">
                  📁 {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={onDeleteSelected}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-950/50 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </button>

        {/* Deselect */}
        <button
          onClick={onClearSelection}
          aria-label="Clear selection"
          className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors ml-1"
        >
          <X size={15} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

import React from 'react';
import {
  Flame,
  CheckCircle2,
  Moon,
  Sun,
  Menu,
  Search,
  Sparkles,
  Command,
} from 'lucide-react';
import { AppStats } from '../../types';

export interface HeaderStatsProps {
  stats: AppStats;
  theme: string;
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onOpenMobileSidebar: () => void;
  viewTitle: string;
  searchInput: string;
  onSearchChange: (value: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  stats,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onOpenMobileSidebar,
  viewTitle,
  searchInput,
  onSearchChange,
  searchInputRef,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            aria-label="Toggle mobile menu"
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="truncate">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
              {viewTitle}
            </h1>
          </div>
        </div>

        {/* Center: Search with '/' shortcut */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-2">
          <div className="relative w-full flex items-center">
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              <Search size={15} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks, notes, tags... (Press /)"
              className="w-full text-xs sm:text-sm bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl py-1.5 pl-9 pr-8 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchInput ? (
              <button
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ×
              </button>
            ) : (
              <kbd className="absolute right-2.5 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Right: Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Completed Today Counter */}
          <div
            title={`${stats.completedTodayCount} tasks completed today`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40 text-xs font-semibold tabular-nums"
          >
            <CheckCircle2 size={13} className="shrink-0" />
            <span className="hidden sm:inline">Done:</span>
            <span>{stats.completedTodayCount}</span>
          </div>

          {/* Daily Streak Counter */}
          <div
            title={`Current streak: ${stats.currentStreak} consecutive day${stats.currentStreak === 1 ? '' : 's'}`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40 text-xs font-semibold tabular-nums"
          >
            <Flame size={13} className="text-amber-500 fill-amber-500 shrink-0" />
            <span>{stats.currentStreak}d</span>
          </div>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            title="Open command palette (⌘K)"
            aria-label="Open command palette"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Command size={12} />
            <kbd className="font-mono text-[10px]">K</kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode (Shift+D)`}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search input bar */}
      <div className="md:hidden px-4 pb-2.5">
        <div className="relative w-full flex items-center">
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, notes, tags..."
            className="w-full text-xs bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-blue-500 rounded-lg py-1.5 pl-8 pr-7 text-slate-900 dark:text-slate-100 focus:outline-none"
          />
          {searchInput && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-xs text-slate-400"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

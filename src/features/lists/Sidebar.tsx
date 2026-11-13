import React from 'react';
import {
  Inbox,
  Calendar,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Tag,
  Download,
  Upload,
  Keyboard,
  Sparkles,
  RefreshCw,
  X,
  Layers,
} from 'lucide-react';
import { CustomList, ActiveView, Task } from '../../types';
import { Badge } from '../../components/ui/Badge';

export interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  lists: CustomList[];
  onOpenCreateList: () => void;
  onDeleteList: (id: string) => void;
  counts: Record<string, number>;
  tasks: Task[];
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  onClearSampleData: () => void;
  onResetSampleData: () => void;
  onExportData: () => void;
  onImportClick: () => void;
  onOpenShortcuts: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  lists,
  onOpenCreateList,
  onDeleteList,
  counts,
  tasks,
  selectedTag,
  onSelectTag,
  onClearSampleData,
  onResetSampleData,
  onExportData,
  onImportClick,
  onOpenShortcuts,
  isOpenMobile,
  onCloseMobile,
}) => {
  // Extract all unique tags and their frequency
  const tagCounts = React.useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t.status !== 'completed') {
        t.tags.forEach((tag) => {
          map[tag] = (map[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [tasks]);

  const defaultNavItems = [
    { id: 'inbox', label: 'Inbox', icon: <Inbox size={16} />, count: counts.inbox || 0 },
    { id: 'today', label: 'Today', icon: <Calendar size={16} />, count: counts.today || 0 },
    { id: 'upcoming', label: 'Upcoming', icon: <CalendarDays size={16} />, count: counts.upcoming || 0 },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 size={16} />, count: counts.completed || 0 },
  ];

  const smartViewItems = [
    {
      id: 'overdue',
      label: 'Overdue',
      icon: <AlertTriangle size={15} className="text-rose-500" />,
      count: counts.overdue || 0,
      isAlert: (counts.overdue || 0) > 0,
    },
    {
      id: 'due-today',
      label: 'Due Today',
      icon: <Clock size={15} className="text-amber-500" />,
      count: counts['due-today'] || 0,
    },
    {
      id: 'next-7-days',
      label: 'Next 7 Days',
      icon: <CalendarDays size={15} className="text-blue-500" />,
      count: counts['next-7-days'] || 0,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/70 border-r border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200">
      {/* Brand header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Layers size={18} />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
              TaskFlow
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable Navigation Body */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core Views */}
        <div className="space-y-0.5">
          {defaultNavItems.map((item) => {
            const isActive = activeView === item.id && selectedTag === 'all';
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onSelectTag('all');
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="text-xs font-mono tabular-nums text-slate-400 dark:text-slate-500">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Smart Views */}
        <div>
          <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Smart Views
          </div>
          <div className="space-y-0.5">
            {smartViewItems.map((item) => {
              const isActive = activeView === item.id && selectedTag === 'all';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    onSelectTag('all');
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.count > 0 && (
                    <span
                      className={`text-xs font-mono tabular-nums ${
                        item.isAlert
                          ? 'text-rose-600 dark:text-rose-400 font-semibold'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Lists */}
        <div>
          <div className="flex items-center justify-between px-3 pb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Projects
            </span>
            <button
              onClick={onOpenCreateList}
              aria-label="Add project list"
              title="Add project list"
              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-0.5">
            {lists.map((list) => {
              const isActive = activeView === list.id && selectedTag === 'all';
              const listCount = counts[list.id] || 0;

              return (
                <div
                  key={list.id}
                  className={`group relative flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectView(list.id);
                      onSelectTag('all');
                      onCloseMobile();
                    }}
                    className="flex-1 flex items-center gap-2.5 text-left truncate cursor-pointer"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: list.color }}
                    />
                    <span className="truncate">{list.name}</span>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {listCount > 0 && (
                      <span className="text-xs font-mono tabular-nums text-slate-400 group-hover:opacity-0 transition-opacity">
                        {listCount}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete project "${list.name}"? Tasks will stay in Inbox.`)) {
                          onDeleteList(list.id);
                        }
                      }}
                      title="Delete project"
                      aria-label={`Delete ${list.name}`}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 rounded transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        {tagCounts.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <Tag size={12} />
              <span>Tags</span>
            </div>
            <div className="flex flex-wrap gap-1 px-3">
              {tagCounts.map(([tagName, count]) => {
                const isTagActive = selectedTag === tagName;
                return (
                  <button
                    key={tagName}
                    onClick={() => {
                      onSelectTag(isTagActive ? 'all' : tagName);
                      onCloseMobile();
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                      isTagActive
                        ? 'bg-blue-600 text-white font-medium shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700/60'
                    }`}
                  >
                    <span>#{tagName}</span>
                    <span className="opacity-60 font-mono text-[10px] tabular-nums">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer Operations */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onExportData}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download size={13} />
            <span>Export</span>
          </button>
          <button
            onClick={onImportClick}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Upload size={13} />
            <span>Import</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={onClearSampleData}
            className="flex items-center justify-center gap-1.5 py-1 px-2 rounded hover:text-slate-800 dark:hover:text-slate-200 text-[11px] transition-colors"
          >
            <Trash2 size={11} />
            <span>Clear demo</span>
          </button>
          <button
            onClick={onResetSampleData}
            className="flex items-center justify-center gap-1.5 py-1 px-2 rounded hover:text-slate-800 dark:hover:text-slate-200 text-[11px] transition-colors"
          >
            <RefreshCw size={11} />
            <span>Reset demo</span>
          </button>
        </div>

        <button
          onClick={onOpenShortcuts}
          className="w-full flex items-center justify-between py-1.5 px-2 mt-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Keyboard size={13} />
            <span>Shortcuts</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono">
            ?
          </kbd>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

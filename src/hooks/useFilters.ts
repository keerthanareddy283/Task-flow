import { useState, useMemo, useEffect } from 'react';
import { FilterState, ActiveView, Priority, TaskStatus, SortField, SortDirection } from '../types';

export function useFilters(initialView: ActiveView = 'inbox') {
  const [activeView, setActiveView] = useState<ActiveView>(initialView);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [tag, setTag] = useState<string | 'all'>('all');
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('order');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filterState: FilterState = useMemo(
    () => ({
      searchQuery: debouncedSearch,
      priority,
      tag,
      status,
      smartView: 'all',
      sortField,
      sortDirection,
    }),
    [debouncedSearch, priority, tag, status, sortField, sortDirection]
  );

  const resetFilters = () => {
    setSearchInput('');
    setPriority('all');
    setTag('all');
    setStatus('all');
    setSortField('order');
    setSortDirection('asc');
  };

  const hasActiveFilters =
    debouncedSearch.trim() !== '' ||
    priority !== 'all' ||
    tag !== 'all' ||
    status !== 'all' ||
    sortField !== 'order';

  return {
    activeView,
    setActiveView,
    searchInput,
    setSearchInput,
    priority,
    setPriority,
    tag,
    setTag,
    status,
    setStatus,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    filterState,
    resetFilters,
    hasActiveFilters,
  };
}

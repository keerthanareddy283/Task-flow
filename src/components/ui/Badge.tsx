import React from 'react';
import { Priority } from '../../types';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'priority-high' | 'priority-medium' | 'priority-low' | 'tag' | 'count';
  size?: 'xs' | 'sm';
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'xs',
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    xs: 'text-[11px] px-1.5 py-0.5 rounded',
    sm: 'text-xs px-2 py-0.5 rounded-md',
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium',
    'priority-high':
      'bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40 font-semibold',
    'priority-medium':
      'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40 font-semibold',
    'priority-low':
      'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 font-medium',
    tag: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40 font-medium',
    count: 'bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-mono tabular-nums text-[11px]',
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={`inline-flex items-center gap-1 leading-none ${sizeClasses[size]} ${variantClasses[variant]} ${
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      } ${className}`}
    >
      {children}
    </Component>
  );
};

export function getPriorityBadge(priority: Priority): React.ReactNode {
  switch (priority) {
    case 'high':
      return <Badge variant="priority-high">! High</Badge>;
    case 'medium':
      return <Badge variant="priority-medium">! Med</Badge>;
    case 'low':
      return <Badge variant="priority-low">! Low</Badge>;
    default:
      return null;
  }
}

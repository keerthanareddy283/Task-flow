import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task, CustomList } from '../../types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { CheckCircle2, ListFilter, Plus } from 'lucide-react';

export interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onReorderTasks: (activeId: string, overId: string) => void;
  selectedTaskIds: string[];
  onToggleSelectBulk: (id: string) => void;
  customLists: CustomList[];
  activeView: string;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onOpenQuickAdd: () => void;
  isDragDisabled?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDelete,
  onSelectTask,
  onUpdateTitle,
  onReorderTasks,
  selectedTaskIds,
  onToggleSelectBulk,
  customLists,
  activeView,
  hasActiveFilters,
  onClearFilters,
  onOpenQuickAdd,
  isDragDisabled = false,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderTasks(String(active.id), String(over.id));
    }
  };

  if (tasks.length === 0) {
    if (hasActiveFilters) {
      return (
        <EmptyState
          icon={<ListFilter size={24} />}
          title="No tasks match your filters"
          description="Try broadening your search query or clearing active priority and status filters."
          actionLabel="Clear Filters"
          onAction={onClearFilters}
        />
      );
    }

    if (activeView === 'completed') {
      return (
        <EmptyState
          icon={<CheckCircle2 size={24} />}
          title="No completed tasks yet"
          description="When you finish tasks, they will be archived here with their completion timestamps."
        />
      );
    }

    if (activeView === 'overdue') {
      return (
        <EmptyState
          icon={<CheckCircle2 size={24} className="text-emerald-500" />}
          title="All caught up!"
          description="You don't have any overdue tasks right now. Great job keeping on top of your schedule."
        />
      );
    }

    return (
      <EmptyState
        icon={<Plus size={24} />}
        title="No tasks in this view"
        description="Capture your ideas, todos, and milestones using the quick-add bar above or keyboard shortcut N."
        actionLabel="Create Task"
        onAction={onOpenQuickAdd}
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onSelectTask={onSelectTask}
              onUpdateTitle={onUpdateTitle}
              isSelectedForBulk={selectedTaskIds.includes(task.id)}
              onToggleSelectBulk={onToggleSelectBulk}
              customLists={customLists}
              isDragDisabled={isDragDisabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

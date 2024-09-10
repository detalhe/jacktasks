export interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export type TabType = 'all' | 'completed' | 'ongoing';

export interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  onAddTask: () => void;
  activeTab: TabType;
}

export interface TaskTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  tasks: Task[];
}

export interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<Task>;
}

import React from 'react';
import { ListTodo, Circle, CheckCircle2 } from 'lucide-react';
import { Task } from '../../types/Task';
import { motion } from 'framer-motion';

type TabType = 'all' | 'ongoing' | 'completed';

interface TaskTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  tasks: Task[];
}

const TaskTabs = ({ activeTab, setActiveTab, tasks }: TaskTabsProps) => {
  const tabs: Array<{ value: TabType; icon: React.ElementType; label: string; count: number }> = [
    { value: 'all', icon: ListTodo, label: 'Todas', count: tasks.length },
    { value: 'ongoing', icon: Circle, label: 'Em Andamento', count: tasks.filter((t) => !t.completed).length },
    { value: 'completed', icon: CheckCircle2, label: 'Concluídas', count: tasks.filter((t) => t.completed).length },
  ];

  const tabVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div className="mb-6" variants={tabVariants} initial="hidden" animate="visible">
      <div className="flex rounded-lg bg-muted p-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 py-2 px-2 sm:px-4 rounded-md transition-all duration-200 ease-in-out ${
              activeTab === tab.value ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:bg-background/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <motion.span
                className="ml-1 sm:ml-2 rounded-full bg-primary/10 px-1.5 sm:px-2 py-0.5 text-xs font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {tab.count}
              </motion.span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default TaskTabs;

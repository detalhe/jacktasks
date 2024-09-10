import React, { useState, useMemo, useEffect } from 'react';
import { NewTaskModal } from '@/components/Tasks/NewTaskModal';
import TaskList from '@/components/Tasks/TaskList';
import TaskTabs from '@/components/Tasks/TaskTabs';
import TaskPagination from '@/components/Tasks/TaskPagination';
import { ListTodo, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Task, TabType } from '../types/Task';
import { Button } from '@/components/ui/button';
import { getTasks, addTask, updateTask, deleteTask } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (newTask: Omit<Task, 'id' | 'completed'>): Promise<Task> => {
    try {
      await addTask(newTask);
      await fetchTasks();
      setIsNewTaskModalOpen(false);
      return newTask as Task;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask.id, updatedTask);
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = useMemo(() => {
    switch (activeTab) {
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'ongoing':
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  }, [tasks, activeTab]);

  const pageCount = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    return filteredTasks.slice(startIndex, startIndex + tasksPerPage);
  }, [filteredTasks, currentPage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="bg-background rounded-lg shadow-lg p-3 sm:p-6" variants={itemVariants}>
        <motion.div className="pb-3 sm:pb-4" variants={itemVariants}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <ListTodo className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h2 className="text-xl sm:text-2xl font-bold">Tarefas</h2>
            </motion.div>
            <Button onClick={() => setIsNewTaskModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Tarefa
            </Button>
          </div>
        </motion.div>
        <Separator />
        <motion.div className="pt-3 sm:pt-6" variants={itemVariants}>
          <TaskTabs activeTab={activeTab} setActiveTab={setActiveTab} tasks={tasks} />
          <motion.div className="bg-card rounded-md border shadow-sm mt-2 sm:mt-4" variants={itemVariants}>
            <TaskList tasks={paginatedTasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onAddTask={() => setIsNewTaskModalOpen(true)} activeTab={activeTab} />
          </motion.div>
          <motion.div className="mt-3 sm:mt-4" variants={itemVariants}>
            <TaskPagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageCount={pageCount} totalTasks={filteredTasks.length} tasksPerPage={tasksPerPage} />
          </motion.div>
        </motion.div>
      </motion.div>
      <NewTaskModal isOpen={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)} onAddTask={handleAddTask} />
    </motion.div>
  );
};

export default Tasks;

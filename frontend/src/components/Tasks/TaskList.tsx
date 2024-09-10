import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Edit, Trash2, MoreVertical, ListChecks, Clock, CalendarDays, Eye, Plus, AlertCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Task, TaskListProps, TabType } from '../../types/Task';
import { useState } from 'react';
import { EditTaskModal } from './EditTaskModal';
import { ViewTaskModal } from './ViewTaskModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, parseISO } from 'date-fns';

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask, onAddTask, activeTab }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (task: Task) => {
    setViewingTask(task);
    setIsViewModalOpen(true);
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const truncateDescription = (description: string | undefined, maxLength: number) => {
    if (!description) return '';
    return description.length <= maxLength ? description : `${description.substring(0, maxLength)}...`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const toggleTask = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };
    await onUpdateTask(updatedTask);
  };

  const getEmptyStateMessage = (tab: TabType) => {
    switch (tab) {
      case 'completed':
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />,
          message: 'Nenhuma tarefa concluída',
        };
      case 'ongoing':
        return {
          icon: <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />,
          message: 'Nenhuma tarefa em andamento',
        };
      default:
        return {
          icon: <ListChecks className="h-12 w-12 text-primary mb-4" />,
          message: 'Nenhuma tarefa encontrada',
        };
    }
  };

  if (tasks.length === 0) {
    const { icon, message } = getEmptyStateMessage(activeTab);
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-64 bg-card rounded-md border shadow-sm mt-2 sm:mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
        <p className="text-lg font-medium text-muted-foreground mb-4">{message}</p>
        <Button variant="link" onClick={onAddTask} className="text-primary hover:text-primary-dark transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar nova tarefa
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <div className="flex items-center">
                <ListChecks className="h-4 w-4 mr-2" />
                Status
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Título
              </div>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <div className="flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Descrição
              </div>
            </TableHead>
            <TableHead className="hidden sm:table-cell">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                Data
              </div>
            </TableHead>
            <TableHead className="w-[50px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.tr key={task.id} className={`${task.completed ? 'bg-muted/50' : ''} h-16 sm:h-10`} variants={tableRowVariants} initial="hidden" animate="visible" exit="exit" layout>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => toggleTask(task)}>
                    {task.completed ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4" />}
                  </Button>
                </TableCell>
                <TableCell className={`${task.completed ? 'text-muted-foreground line-through' : ''} font-medium`}>
                  {task.title}
                  <p className="text-sm text-muted-foreground md:hidden">{truncateDescription(task.description, 50)}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">{formatDate(task.date)}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-default">{truncateDescription(task.description, 100)}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-md">{task.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{formatDate(task.date)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewClick(task)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Visualizar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClick(task)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteTask(task.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
      <EditTaskModal task={editingTask} onEditTask={onUpdateTask} open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
      <ViewTaskModal task={viewingTask} open={isViewModalOpen} onOpenChange={setIsViewModalOpen} />
    </div>
  );
};

export default TaskList;

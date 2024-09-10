import { useState, useMemo, useRef, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Task } from '../types/Task';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import CalendarGrid from '@/components/Calendar/CalendarGrid';
import CalendarTaskList from '@/components/Calendar/CalendarTaskList';
import { getTasks, updateTask } from '../services/api';

const Calendar = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendarHeight, setCalendarHeight] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(
        fetchedTasks.map((task: Task) => ({
          ...task,
          date: parseISO(task.date),
        }))
      );
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const tasksByDate = useMemo(
    () =>
      tasks.reduce((acc: Record<string, Task[]>, task: Task) => {
        const dateString = format(task.date, 'yyyy-MM-dd');
        if (!acc[dateString]) acc[dateString] = [];
        acc[dateString].push(task);
        return acc;
      }, {}),
    [tasks]
  );

  const selectedTasks = useMemo(() => tasks.filter((task: Task) => isSameDay(task.date, selectedDate)), [selectedDate, tasks]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  useEffect(() => {
    const updateCalendarHeight = () => {
      if (calendarRef.current) setCalendarHeight(calendarRef.current.offsetHeight);
    };
    updateCalendarHeight();
    window.addEventListener('resize', updateCalendarHeight);
    return () => window.removeEventListener('resize', updateCalendarHeight);
  }, [currentMonth]);

  const handleToggleTask = async (taskId: number) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask: Task = { ...taskToUpdate, completed: !taskToUpdate.completed };
      try {
        await updateTask(taskId, updatedTask);
        setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="bg-background rounded-lg shadow-lg p-3 sm:p-6" variants={itemVariants}>
        <motion.div className="pb-3 sm:pb-4" variants={itemVariants}>
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
              <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h2 className="text-xl sm:text-2xl font-bold">Calendário</h2>
            </motion.div>
            <div className="flex space-x-2">
              <Link to="/tasks">
                <Button variant="outline" size="sm" className="text-sm">
                  Gerenciar Tarefas
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
        <Separator />
        <motion.div className="pt-4 sm:pt-6" variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2" ref={calendarRef}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="text-lg sm:text-xl font-semibold">{format(currentMonth, 'MMMM yyyy', { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase())}</CardTitle>
                    <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CalendarGrid calendarDays={calendarDays} currentMonth={currentMonth} selectedDate={selectedDate} setSelectedDate={setSelectedDate} tasksByDate={tasksByDate} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 lg:mt-0 relative" style={{ height: `${calendarHeight}px`, minHeight: '300px' }}>
              <CalendarTaskList selectedDate={selectedDate} selectedTasks={selectedTasks} toggleTask={handleToggleTask} />
              <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-16 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Calendar;

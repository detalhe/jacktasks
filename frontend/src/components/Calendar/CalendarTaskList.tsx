import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '../../types/Task';
import { CalendarIcon, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CalendarTaskListProps {
  selectedDate: Date;
  selectedTasks: Task[];
  toggleTask: (id: number) => void;
}

const CalendarTaskList: React.FC<CalendarTaskListProps> = ({ selectedDate, selectedTasks, toggleTask }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <span>Tarefas em {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <ScrollArea className="h-full pr-2 sm:pr-4">
          <AnimatePresence>
            {selectedTasks.length > 0 ? (
              selectedTasks.map((task) => (
                <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="mb-2 sm:mb-4">
                  <Card className={task.completed ? 'bg-muted' : ''}>
                    <CardContent className="p-2 sm:p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-2">
                          <h3 className={`text-sm sm:text-base font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{task.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8" onClick={() => toggleTask(task.id)}>
                          {task.completed ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" /> : <Circle className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </Button>
                      </div>
                      <div className="flex items-center mt-2 text-[0.6rem] sm:text-xs text-muted-foreground">
                        <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        <span>{format(task.date, 'HH:mm')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div className="flex flex-col items-center justify-center h-full text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <CalendarIcon className="h-8 w-8 sm:h-12 sm:w-12 mb-2 sm:mb-4 text-muted-foreground/50" />
                <p className="text-base sm:text-lg font-medium text-center">Nenhuma tarefa neste dia</p>
                <p className="text-xs sm:text-sm text-center mt-1">
                  Selecione outro dia ou{' '}
                  <Link to="/tasks" className="underline">
                    adicione
                  </Link>{' '}
                  novas tarefas
                </p>
                </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CalendarTaskList;

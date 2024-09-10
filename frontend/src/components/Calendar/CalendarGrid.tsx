import { format, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '../../types/Task';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CalendarGridProps {
  calendarDays: Date[];
  currentMonth: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  tasksByDate: Record<string, Task[]>;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ calendarDays, currentMonth, selectedDate, setSelectedDate, tasksByDate }) => {
  const renderCalendarDay = (day: Date, index: number) => {
    const dateString = format(day, 'yyyy-MM-dd');
    const dayTasks = tasksByDate[dateString] || [];
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isSelected = isSameDay(day, selectedDate);
    const isCurrentDay = isToday(day);

    return (
      <TooltipProvider key={index}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={`h-10 sm:h-14 md:h-20 lg:h-24 w-full p-0.5 sm:p-1 flex flex-col items-center justify-between ${!isCurrentMonth ? 'opacity-30' : ''} ${
                isSelected ? 'border-primary border-2' : ''
              } ${isCurrentDay ? 'bg-accent text-accent-foreground' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="w-full flex justify-between items-center">
                <span className={`text-xs sm:text-sm md:text-base lg:text-xl font-semibold ${isSelected ? 'text-primary' : ''}`}>{format(day, 'd')}</span>
                {dayTasks.length > 0 && (
                  <Badge variant="secondary" className="text-[0.5rem] sm:text-xs px-0.5 py-0 sm:px-1 sm:py-0.5">
                    {dayTasks.length}
                  </Badge>
                )}
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{format(day, 'dd/MM/yyyy')}</p>
            <p>{dayTasks.length} tarefa(s)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
        <div key={day} className="text-center font-medium text-xs sm:text-sm py-1 sm:py-2">
          {day}
        </div>
      ))}
      {calendarDays.map((day, index) => renderCalendarDay(day, index))}
    </div>
  );
};

export default CalendarGrid;

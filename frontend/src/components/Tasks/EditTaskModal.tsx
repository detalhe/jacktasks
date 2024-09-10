import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Task } from '../../types/Task';

interface EditTaskModalProps {
  task: Task | null;
  onEditTask: (task: Task) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskModal({ task, onEditTask, open, onOpenChange }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDate(task.date ? parseISO(task.date) : undefined);
      setCompleted(task.completed);
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('O título é obrigatório');
      return;
    }
    if (task) {
      setIsSubmitting(true);
      try {
        await onEditTask({
          ...task,
          title,
          description,
          date: date ? format(date, 'yyyy-MM-dd') : '',
          completed,
        });
        setError('');
        onOpenChange(false);
      } catch (err) {
        setError('Erro ao editar tarefa');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Editar Tarefa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-sm sm:text-base">
              Título
            </Label>
            <Input id="title" placeholder="Título da tarefa" value={title} onChange={(e) => setTitle(e.target.value)} className="text-sm sm:text-base" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm sm:text-base">
              Descrição
            </Label>
            <Textarea id="description" placeholder="Descrição da tarefa" value={description} onChange={(e) => setDescription(e.target.value)} className="text-sm sm:text-base" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date" className="text-sm sm:text-base">
              Data
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal text-sm sm:text-base', !date && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Escolha uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="rounded-md border" />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="completed" checked={completed} onChange={(e) => setCompleted(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
            <Label htmlFor="completed" className="text-sm sm:text-base">
              Concluída
            </Label>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm sm:text-base">{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} className="w-full sm:w-auto text-sm sm:text-base" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Task } from '../../types/Task';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle2, Circle, AlignLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ViewTaskModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewTaskModal({ task, open, onOpenChange }: ViewTaskModalProps) {
  if (!task) return null;

  const descriptionLength = task.description?.length || 0;
  const isLargeDescription = descriptionLength > 300;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Detalhes da Tarefa</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Título</h3>
            <p className="text-base font-semibold break-words">{task.title}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center">
              <AlignLeft className="mr-2 h-4 w-4" />
              Descrição
            </h3>
            {task.description ? (
              isLargeDescription ? (
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <p className="text-sm whitespace-pre-wrap break-words">{task.description}</p>
                </ScrollArea>
              ) : (
                <p className="text-sm whitespace-pre-wrap break-words">{task.description}</p>
              )
            ) : (
              <p className="text-sm italic">Sem descrição</p>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data</h3>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">{task.date ? format(task.date, 'PPP') : <span className="italic">Sem data definida</span>}</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Status</h3>
            <div className="flex items-center">
              {task.completed ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Concluída</span>
                </>
              ) : (
                <>
                  <Circle className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Em andamento</span>
                </>
              )}
            </div>
          </div>
        </div>
        <DialogClose asChild>
          <Button className="w-full sm:w-auto">Fechar</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

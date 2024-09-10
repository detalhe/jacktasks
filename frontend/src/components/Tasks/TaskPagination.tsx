import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { motion } from 'framer-motion';

interface TaskPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageCount: number;
  totalTasks: number;
  tasksPerPage: number;
}

const TaskPagination = ({ currentPage, setCurrentPage, pageCount, totalTasks, tasksPerPage }: TaskPaginationProps) => {
  const startIndex = (currentPage - 1) * tasksPerPage + 1;
  const endIndex = Math.min(currentPage * tasksPerPage, totalTasks);

  const paginationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div className="mt-4 flex flex-col sm:flex-row items-center justify-between" variants={paginationVariants} initial="hidden" animate="visible">
      <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
        Mostrando {startIndex}-{endIndex} de {totalTasks} tarefas
      </p>
      <div className="flex justify-end w-full sm:w-auto">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
            </PaginationItem>
            {[...Array(pageCount)].map((_, index) => (
              <PaginationItem key={index} className="hidden sm:inline-block">
                <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1} className="cursor-pointer">
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setCurrentPage(Math.min(currentPage + 1, pageCount))} className={currentPage === pageCount ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </motion.div>
  );
};

export default TaskPagination;

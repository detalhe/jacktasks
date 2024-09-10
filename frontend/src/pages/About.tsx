import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Info, Code, Coffee, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TechStack {
  name: string;
  description: string;
}

const techStack: TechStack[] = [
  { name: 'React', description: 'Biblioteca JavaScript para construção da interface de usuário' },
  { name: 'TypeScript', description: 'Superset tipado de JavaScript para maior segurança e produtividade' },
  { name: 'Tailwind CSS', description: 'Framework CSS utilitário para estilização rápida e consistente' },
  { name: 'Vite', description: 'Build tool e dev server para desenvolvimento rápido' },
  { name: 'Framer Motion', description: 'Biblioteca para criação de animações fluidas' },
  { name: 'shadcn/ui', description: 'Componentes de UI reutilizáveis e customizáveis' },
  { name: 'React Router', description: 'Gerenciamento de rotas na aplicação' },
  { name: 'Context API', description: 'Gerenciamento de estado global' },
  { name: 'Axios', description: 'Cliente HTTP para requisições à API' },
  { name: 'JWT', description: 'Autenticação baseada em tokens' },
];

export default function About() {
  const [visibleTech, setVisibleTech] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleTech((prev) => (prev < techStack.length ? prev + 1 : prev));
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-background rounded-lg shadow-lg p-6">
        <div className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Info className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Sobre JackTasks</h2>
            </div>
            <Button variant="outline" asChild>
              <a href="https://github.com/detalhe/jacktasks" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Repositório GitHub
              </a>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="pt-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold flex items-center mb-3">
              <Info className="h-5 w-5 text-primary mr-2" />O Projeto
            </h2>
            <p className="text-muted-foreground">Aplicação web moderna e responsiva de gerenciamento de tarefas, desenvolvida com React e TypeScript.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold flex items-center mb-3">
              <Code className="h-5 w-5 text-primary mr-2" />
              Principais Funcionalidades
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Cadastro e autenticação de usuários com JWT</li>
              <li>CRUD completo de tarefas para usuários autenticados</li>
              <li>Visualização de tarefas em formato de calendário</li>
              <li>Análise de métricas com gráficos detalhados</li>
              <li>Interface responsiva com suporte a tema claro e escuro</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold flex items-center mb-3">
              <Coffee className="h-5 w-5 text-primary mr-2" />
              Tecnologias Utilizadas
            </h2>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {techStack.slice(0, visibleTech).map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary">{tech.name}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{tech.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

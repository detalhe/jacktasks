import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, Pie, PieChart, Label, Bar, BarChart } from 'recharts';
import { getTasks } from '../services/api';
import { Task } from '../types/Task';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Analytics: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; completed: number; ongoing: number }[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
      generateMonthlyData(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const generateMonthlyData = (fetchedTasks: Task[]) => {
    const sixMonthsAgo = subMonths(new Date(), 5);
    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(new Date()),
    });

    const data = months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthTasks = fetchedTasks.filter((task) => {
        const taskDate = parseISO(task.date);
        return taskDate >= monthStart && taskDate <= monthEnd;
      });

      return {
        month: format(month, 'MMMM', { locale: ptBR }),
        completed: monthTasks.filter((task) => task.completed).length,
        ongoing: monthTasks.filter((task) => !task.completed).length,
      };
    });

    setMonthlyData(data);
  };

  const pieChartData = [
    { status: 'Concluídas', count: tasks.filter((t) => t.completed).length, fill: 'var(--color-completed)' },
    { status: 'Em andamento', count: tasks.filter((t) => !t.completed).length, fill: 'var(--color-ongoing)' },
  ];

  const totalTasks = tasks.length;

  const chartConfig: ChartConfig = {
    completed: {
      label: 'Concluídas',
      color: 'hsl(var(--chart-1))',
    },
    ongoing: {
      label: 'Em andamento',
      color: 'hsl(var(--chart-2))',
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const calculateGrowthTrend = () => {
    if (monthlyData.length < 2) return 0;
    const currentMonth = monthlyData[monthlyData.length - 1].completed;
    const previousMonth = monthlyData[monthlyData.length - 2].completed;
    if (previousMonth === 0) return currentMonth > 0 ? 100 : 0;
    return ((currentMonth - previousMonth) / previousMonth) * 100;
  };

  const growthTrend = calculateGrowthTrend();

  return (
    <motion.div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="bg-background rounded-lg shadow-lg p-3 sm:p-6" variants={itemVariants}>
        <motion.div className="pb-3 sm:pb-4" variants={itemVariants}>
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h2 className="text-xl sm:text-2xl font-bold">Métricas</h2>
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
        <motion.div className="pt-4 sm:pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={itemVariants}>
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Distribuição de Tarefas</CardTitle>
              <CardDescription>Concluídas vs. Em andamento</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={pieChartData} dataKey="count" nameKey="status" innerRadius={60} strokeWidth={5}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                {totalTasks}
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                Total
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Progresso geral: {totalTasks > 0 ? ((pieChartData[0].count / totalTasks) * 100).toFixed(1) : 0}%
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progresso Mensal</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  data={monthlyData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="completed" stroke="var(--color-completed)" strokeWidth={2} dot={{ fill: 'var(--color-completed)' }} />
                  <Line type="monotone" dataKey="ongoing" stroke="var(--color-ongoing)" strokeWidth={2} dot={{ fill: 'var(--color-ongoing)' }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Tendência de crescimento: {growthTrend.toFixed(1)}% este mês
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparativo Mensal</CardTitle>
              <CardDescription>Tarefas Concluídas vs. Em Andamento</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  data={monthlyData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ongoing" fill="var(--color-ongoing)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Eficiência de conclusão:{' '}
                {monthlyData.length > 0
                  ? ((monthlyData[monthlyData.length - 1].completed / (monthlyData[monthlyData.length - 1].completed + monthlyData[monthlyData.length - 1].ongoing)) * 100).toFixed(1)
                  : 0}
                %
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;

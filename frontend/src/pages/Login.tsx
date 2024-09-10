import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useTheme } from '../components/theme-provider';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { theme, setTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      newErrors.username = 'O nome de usuário é obrigatório';
    }
    if (!password) {
      newErrors.password = 'A senha é obrigatória';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/tasks');
    } catch (err: any) {
      setErrors({ general: 'Credenciais inválidas.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  const logoSrc = theme === 'dark' ? '/newjackwhite.png' : '/newjack.png';

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-background p-4" initial="hidden" animate="visible" variants={containerVariants}>
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <motion.div className="flex justify-between items-center" variants={itemVariants}>
            <div className="flex flex-col items-start">
              <div className="flex items-center space-x-2">
                <motion.img src={logoSrc} alt="JackTasks Ícone" className="h-6 w-auto" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} />
                <CardTitle className="text-2xl font-bold">JackTasks</CardTitle>
              </div>
              <CardDescription className="text-left font-medium mt-1">Planeje. Acompanhe. Realize.</CardDescription>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="mr-2">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Alternar tema</span>
              </Button>
            </motion.div>
          </motion.div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="username">Usuário</Label>
              <Input id="username" type="text" placeholder="Nome de Usuário" value={username} onChange={(e) => setUsername(e.target.value)} className={errors.username ? 'border-red-500' : ''} />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className={errors.password ? 'border-red-500' : ''} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </motion.div>
            {errors.general && <div className="text-red-500 text-sm">{errors.general}</div>}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </motion.div>
          </form>
          <motion.div className="mt-4 text-center text-sm" variants={itemVariants}>
            Não tem uma conta?{' '}
            <Link to="/register" className="underline">
              Cadastre-se
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

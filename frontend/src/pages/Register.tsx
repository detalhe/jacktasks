import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useTheme } from '../components/theme-provider';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { register as apiRegister } from '../services/api';

export function Register() {
  const { theme, setTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      await apiRegister(username, password);
      await login(username, password);
      navigate('/tasks');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Nome de usuário já existe');
      } else {
        setError(err.response?.data?.message || 'Erro ao registrar usuário. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              <CardDescription className="text-left font-medium mt-1">Crie sua conta</CardDescription>
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
              <Label htmlFor="username">Nome de usuário</Label>
              <Input id="username" type="text" placeholder="Nome de usuário" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirmar senha" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </motion.div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Registrar'}
              </Button>
            </motion.div>
          </form>
          <motion.div className="mt-4 text-center text-sm" variants={itemVariants}>
            Já tem uma conta?{' '}
            <Link to="/login" className="underline">
              Faça login
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, Calendar, LineChart, Info, LucideIcon, PanelLeftClose } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from './theme-provider';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <motion.div
      className="border-r bg-muted/40 hidden md:block overflow-hidden"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: isOpen ? 256 : 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
    >
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="sidebar-content"
            initial={{ x: -256, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -256, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="w-64"
          >
            <SidebarContent onClose={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SidebarContentProps {
  onClose?: () => void;
}

export function SidebarContent({ onClose }: SidebarContentProps) {
  const location = useLocation();
  const { theme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const navItems: NavItem[] = [
    { path: '/tasks', icon: CheckSquare, label: 'Tarefas' },
    { path: '/calendar', icon: Calendar, label: 'Calendário' },
    { path: '/analytics', icon: LineChart, label: 'Métricas' },
    { path: '/about', icon: Info, label: 'Sobre' },
  ];

  const NavLink = ({ path, icon: Icon, label }: NavItem) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link to={path} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary', isActive(path) ? 'bg-muted text-primary' : 'text-muted-foreground')}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    </motion.div>
  );

  const logoSrc = theme === 'dark' ? '/newjackwhite.png' : '/newjack.png';

  return (
    <motion.div className="flex h-full flex-col" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <motion.div
        className="flex h-14 items-center justify-between border-b px-6 lg:h-[60px]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Link to="/" className="flex items-center justify-center space-x-2">
          <img src={logoSrc} alt="JackTasks Ícone" className="h-6 w-auto" />
          <span className="text-lg font-bold">JackTasks</span>
        </Link>
        {onClose && (
          <motion.button onClick={onClose} className="md:flex hidden text-muted-foreground hover:text-foreground transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <PanelLeftClose className="h-5 w-5" />
          </motion.button>
        )}
      </motion.div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item, index) => (
          <motion.div key={item.path} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}>
            <NavLink {...item} />
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}

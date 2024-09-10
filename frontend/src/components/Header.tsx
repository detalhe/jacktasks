import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { HelpCircle, LogOut, Moon, Sun, Menu, PanelLeftOpen } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { SidebarContent } from './Sidebar';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const userInitial = user?.username ? user.username.substring(0, 1).toUpperCase() : 'J';

  return (
    <motion.header
      className="flex h-14 items-center justify-between border-b bg-muted/40 px-6 lg:h-[60px]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div className="flex items-center" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
        <div className="md:hidden mr-4">
          <Sheet>
            <SheetTrigger asChild>
              <motion.button className="shrink-0" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </motion.button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden md:block">
          {!isSidebarOpen && (
            <motion.button
              onClick={onToggleSidebar}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center h-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <PanelLeftOpen className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </motion.div>
      <motion.div className="flex items-center gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
        <motion.button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="mr-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </motion.button>
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <span className="font-semibold">{userInitial}</span>
                <span className="sr-only">Toggle user menu</span>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/about" className="flex items-center w-full cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Sobre</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!isAuthenticated && (
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
        )}
      </motion.div>
    </motion.header>
  );
}

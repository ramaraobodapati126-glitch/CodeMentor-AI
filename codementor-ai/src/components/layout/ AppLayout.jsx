import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Code2, MessageSquare, Home, Menu, X, Brain, Zap, Sun, Moon, ChevronRight } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/code', label: 'Code Lab', icon: Code2 },
  { path: '/chat', label: 'AI Chat', icon: MessageSquare },
];

export default function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border/40 fixed inset-y-0 left-0 z-40 bg-card/60 backdrop-blur-2xl">
        {/* Logo */}
        <div className="px-5 py-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="font-inter font-bold text-foreground text-[15px] leading-none">CodeMentor</p>
              <p className="text-[9px] text-primary font-semibold tracking-widest uppercase mt-0.5">AI Powered</p>
            </div>
          </Link>
        </div>

        <div className="px-3 mb-2">
          <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-2 mb-1">Navigation</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {isActive && (
                    <motion.div layoutId="sidebarActive"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary"
                    />
                  )}
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 text-primary/60" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 space-y-2 border-t border-border/30 mt-4">
          {/* Theme toggle */}
          <button onClick={toggle}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              {theme === 'dark'
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-primary" />}
              <span className="text-sm font-medium text-foreground">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-secondary' : 'bg-primary'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${theme === 'dark' ? 'left-0.5' : 'left-4'}`} />
            </div>
          </button>

          {/* Memory badge */}
          <div className="px-3 py-3 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold text-primary">Memory Active</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Learning patterns are being tracked for personalized guidance.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-card/80 backdrop-blur-2xl border-b border-border/40">
        <div className="flex items-center justify-between px-4 py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md shadow-primary/30">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-inter font-bold text-foreground">CodeMentor</span>
          </Link>
          <div className="flex items-center gap-1">
            <button onClick={toggle} className="p-2 rounded-xl hover:bg-secondary/50 transition-colors text-muted-foreground">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl hover:bg-secondary/50 transition-colors text-foreground">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/40 bg-card/90">
              <div className="p-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}>
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Main */}
      <main className="flex-1 md:ml-60 pt-16 md:pt-0 min-w-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-5 md:p-8 max-w-7xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Brain, Code2, AlertTriangle, TrendingUp, Flame, Target } from 'lucide-react';

import TopicChart from '../components/dashboard/TopicChart';
import MistakeTimeline from '../components/dashboard/MistakeTimeline';
import RecentMistakes from '../components/dashboard/RecentMistakes';
import StrengthWeakness from '../components/dashboard/StrengthWeakness';
import Recommendations from '../components/dashboard/Recommendations';

function StatCard({ label, value, icon: IconComp, gradient, delay = 0, sub }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
      className="relative rounded-2xl p-6 overflow-hidden group border border-border/40 bg-card/60 backdrop-blur-sm hover:border-border/70 transition-all duration-300 hover:-translate-y-0.5">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 group-hover:opacity-60 transition-opacity`} />
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-gradient-to-bl from-white/5 to-transparent blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} border border-white/10 flex items-center justify-center`}>
            <IconComp className="w-5 h-5 text-white/90" />
          </div>
        </div>
        <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>
        <p className="text-xs font-semibold text-muted-foreground mt-1">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: memories = [], isLoading: memLoading } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.LearningMemory.list('-created_date', 100),
  });
  const { data: sessions = [], isLoading: sessLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.CodingSession.list('-created_date', 50),
  });

  const totalMistakes = memories.reduce((sum, m) => sum + (m.frequency || 1), 0);
  const resolvedCount = memories.filter(m => m.resolved).length;
  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((s, sess) => s + (sess.score || 0), 0) / sessions.length) : 0;
  const progressScore = memories.length > 0
    ? Math.round((resolvedCount / memories.length) * 100) : 0;

  const isLoading = memLoading || sessLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-inter font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Your personalized learning overview</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/15">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold text-primary">Memory Active</span>
        </div>
      </motion.div>

      {/* Stat cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Sessions" value={sessions.length} icon={Code2} gradient="from-violet-600/30 to-violet-600/5" delay={0} sub="code submissions" />
          <StatCard label="Mistakes Tracked" value={totalMistakes} icon={AlertTriangle} gradient="from-red-500/30 to-red-500/5" delay={0.08} sub="across all topics" />
          <StatCard label="Average Score" value={`${avgScore}%`} icon={TrendingUp} gradient="from-emerald-500/30 to-emerald-500/5" delay={0.16} sub="code quality" />
          <StatCard label="Progress" value={`${progressScore}%`} icon={Brain} gradient="from-sky-500/30 to-sky-500/5" delay={0.24} sub="mistakes resolved" />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <MistakeTimeline sessions={sessions} />
        </div>
        <div className="lg:col-span-2">
          <TopicChart memories={memories} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <StrengthWeakness memories={memories} />
        <RecentMistakes memories={memories} />
        <Recommendations memories={memories} />
      </div>
    </div>
  );
}
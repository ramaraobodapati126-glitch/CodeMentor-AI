import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function RecentMistakes({ memories }) {
  const sorted = [...memories].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 7);

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 h-full">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Recent Mistakes</p>

      {sorted.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-sm text-muted-foreground/50">No mistakes yet</div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
          {sorted.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/20">
              <div className="mt-0.5 shrink-0">
                {m.resolved
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  : <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{m.mistake_type}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{m.problem_type}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-secondary border border-border/40 text-muted-foreground font-mono">{m.language}</span>
                  <span className="text-[9px] text-muted-foreground/60">{format(new Date(m.created_date), 'MMM d')}</span>
                  {m.frequency > 1 && <span className="text-[9px] text-orange-400 font-bold">×{m.frequency}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
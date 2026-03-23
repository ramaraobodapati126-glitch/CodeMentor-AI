import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StrengthWeakness({ memories }) {
  const topicData = {};
  memories.forEach(m => {
    if (!topicData[m.problem_type]) topicData[m.problem_type] = { total: 0, resolved: 0 };
    topicData[m.problem_type].total += (m.frequency || 1);
    if (m.resolved) topicData[m.problem_type].resolved += 1;
  });

  const topics = Object.entries(topicData).map(([name, d]) => ({
    name,
    score: d.total === 0 ? 100 : Math.round((d.resolved / (d.resolved + d.total)) * 100),
    mistakes: d.total,
  })).sort((a, b) => a.score - b.score);

  const weak = topics.filter(t => t.score < 50);
  const strong = topics.filter(t => t.score >= 50);

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 h-full">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5">Strengths & Weaknesses</p>

      {topics.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-sm text-muted-foreground/50">Submit code to see your profile</div>
      ) : (
        <div className="space-y-5">
          {weak.length > 0 && (
            <div>
              <p className="text-xs font-bold text-red-400 mb-3 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Needs Work
              </p>
              <div className="space-y-2.5">
                {weak.slice(0, 4).map((t, i) => (
                  <div key={t.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground/80 font-medium truncate max-w-[140px]">{t.name}</span>
                      <span className="text-muted-foreground shrink-0 ml-2">{t.mistakes} errors</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${t.score}%` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {strong.length > 0 && (
            <div>
              <p className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strong
              </p>
              <div className="space-y-2.5">
                {strong.slice(0, 4).map((t, i) => (
                  <div key={t.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground/80 font-medium truncate max-w-[140px]">{t.name}</span>
                      <span className="text-emerald-400 shrink-0 ml-2">{t.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${t.score}%` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
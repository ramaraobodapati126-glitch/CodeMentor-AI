import React from 'react';
import { Lightbulb, ArrowRight, BookOpen, Target, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';

const priorityStyle = {
  High: "border-red-500/20 bg-red-500/5 text-red-400",
  Medium: "border-orange-500/20 bg-orange-500/5 text-orange-400",
  Low: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
  Start: "border-primary/20 bg-primary/5 text-primary",
};

export default function Recommendations({ memories }) {
  const topicFreq = {};
  memories.filter(m => !m.resolved).forEach(m => {
    topicFreq[m.problem_type] = (topicFreq[m.problem_type] || 0) + (m.frequency || 1);
  });

  const weakTopics = Object.entries(topicFreq).sort(([,a],[,b]) => b-a).slice(0, 3);
  const recs = weakTopics.map(([topic, freq]) => ({
    topic, freq,
    suggestion: `Focus on ${topic} problems to reduce recurring errors.`,
    icon: freq > 3 ? Repeat : freq > 1 ? Target : BookOpen,
    priority: freq > 3 ? 'High' : freq > 1 ? 'Medium' : 'Low',
  }));

  if (recs.length === 0) recs.push({ topic: 'Get Started', freq: 0, suggestion: 'Submit your first code to unlock personalized recommendations.', icon: Lightbulb, priority: 'Start' });

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-3.5 h-3.5 text-accent" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recommendations</p>
      </div>
      <div className="space-y-2.5">
        {recs.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 p-3.5 rounded-xl border border-border/30 bg-secondary/20 hover:bg-secondary/40 transition-colors group cursor-default">
            <div className="w-8 h-8 rounded-xl bg-accent/8 border border-accent/15 flex items-center justify-center shrink-0">
              <r.icon className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-xs font-bold text-foreground truncate">{r.topic}</p>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold shrink-0 ${priorityStyle[r.priority]}`}>{r.priority}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{r.suggestion}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
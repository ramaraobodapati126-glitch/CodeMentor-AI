import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Code2, ChevronDown, ChevronUp, Zap, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';

const SEV = {
  high: "text-red-400 bg-red-500/8 border-red-500/15",
  medium: "text-orange-400 bg-orange-500/8 border-orange-500/15",
  low: "text-yellow-400 bg-yellow-500/8 border-yellow-500/15",
};

function ScoreRing({ score }) {
  const r = 36, c = 2 * Math.PI * r;
  const filled = (score / 100) * c;
  const color = score >= 80 ? '#34d399' : score >= 50 ? '#fb923c' : '#f87171';
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90 absolute">
        <circle cx="48" cy="48" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
        <motion.circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={c} strokeLinecap="round"
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - filled }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="text-center z-10">
        <p className="text-2xl font-black" style={{ color }}>{score}</p>
        <p className="text-[9px] text-muted-foreground font-semibold">/100</p>
      </div>
    </div>
  );
}

function Section({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

export default function AnalysisResult({ result }) {
  const [showCorrected, setShowCorrected] = useState(false);
  if (!result) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Score + Memory */}
      <Section>
        <div className="flex items-center gap-6">
          <ScoreRing score={result.score || 0} />
          <div className="flex-1">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Code Quality Score</p>
            <p className={`text-lg font-bold ${result.score >= 80 ? 'text-emerald-400' : result.score >= 50 ? 'text-orange-400' : 'text-red-400'}`}>
              {result.score >= 80 ? 'Excellent' : result.score >= 50 ? 'Needs Work' : 'Critical Issues'}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {result.topics?.map((t, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-primary/8 text-primary/70 border border-primary/15 font-medium">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Memory hint */}
      {result.memory_hint && (
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Section className="border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary mb-1.5 uppercase tracking-wider">Memory Insight</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{result.memory_hint}</p>
              </div>
            </div>
          </Section>
        </motion.div>
      )}

      {/* Analysis */}
      <Section>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-foreground">Analysis</h3>
        </div>
        <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-accent prose-code:bg-secondary/50 prose-code:rounded prose-code:px-1">
          <ReactMarkdown>{result.analysis}</ReactMarkdown>
        </div>
      </Section>

      {/* Mistakes */}
      {result.mistakes?.length > 0 && (
        <Section>
          <h3 className="text-sm font-bold text-foreground mb-3">
            Mistakes Found <span className="text-muted-foreground font-normal">({result.mistakes.length})</span>
          </h3>
          <div className="space-y-2">
            {result.mistakes.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className={`flex items-start gap-3 p-3 rounded-xl border ${SEV[m.severity]}`}>
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{m.type}</p>
                    <Badge className={`text-[10px] py-0 px-1.5 ${SEV[m.severity]} border`}>{m.severity}</Badge>
                  </div>
                  <p className="text-xs mt-0.5 opacity-80">{m.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Corrected code */}
      {result.corrected_code && (
        <Section>
          <button onClick={() => setShowCorrected(!showCorrected)}
            className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-foreground">Corrected Code</h3>
            </div>
            {showCorrected ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {showCorrected && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <pre className="mt-4 p-4 rounded-xl bg-[#0d1117] border border-white/10 text-sm font-mono text-[#e6edf3] overflow-x-auto">
                  <code>{result.corrected_code}</code>
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>
      )}
    </motion.div>
  );
}
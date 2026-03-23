import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Play, Brain, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CodeEditor from '../components/code/CodeEditor';
import AnalysisResult from '../components/code/AnalysisResult';

const languages = [
  { value: 'python', label: 'Python', color: 'text-yellow-400' },
  { value: 'java', label: 'Java', color: 'text-orange-400' },
  { value: 'cpp', label: 'C++', color: 'text-blue-400' },
  { value: 'javascript', label: 'JavaScript', color: 'text-yellow-300' },
];

const ANALYZING_STEPS = ['Reading code structure...', 'Checking logic patterns...', 'Querying memory context...', 'Building personalized feedback...'];

export default function CodeLab() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState(null);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const queryClient = useQueryClient();

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.LearningMemory.list('-created_date', 50),
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      // Cycle through steps
      let step = 0;
      const stepInterval = setInterval(() => {
        step = (step + 1) % ANALYZING_STEPS.length;
        setAnalyzeStep(step);
      }, 900);

      const pastMistakes = memories.slice(0, 10).map(m =>
        `- ${m.problem_type}: ${m.mistake_type} (${m.frequency}x, ${m.language})`).join('\n');
      const memoryContext = pastMistakes
        ? `\n\nUSER'S PAST MISTAKES:\n${pastMistakes}\n\nIMPORTANT: Reference their past mistakes in your analysis.`
        : '';

      const analysisResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert coding mentor. Analyze this ${language} code and provide detailed feedback.\n\nCODE:\n\`\`\`${language}\n${code}\n\`\`\`${memoryContext}\n\nProvide: score (0-100), analysis (markdown), mistakes array, topics array, corrected_code, and memory_hint if past mistakes are relevant.`,
        response_json_schema: {
          type: "object",
          properties: {
            score: { type: "number" },
            analysis: { type: "string" },
            mistakes: { type: "array", items: { type: "object", properties: {
              type: { type: "string" }, description: { type: "string" },
              severity: { type: "string", enum: ["low","medium","high"] },
              problem_type: { type: "string" }
            }}},
            topics: { type: "array", items: { type: "string" } },
            corrected_code: { type: "string" },
            memory_hint: { type: "string" },
          }
        }
      });

      clearInterval(stepInterval);

      await base44.entities.CodingSession.create({
        code, language, analysis: analysisResponse.analysis,
        mistakes: analysisResponse.mistakes, corrected_code: analysisResponse.corrected_code,
        topics: analysisResponse.topics, score: analysisResponse.score,
      });

      if (analysisResponse.mistakes?.length > 0) {
        for (const mistake of analysisResponse.mistakes) {
          const existing = memories.find(m =>
            m.problem_type === (mistake.problem_type || 'general') &&
            m.mistake_type === mistake.type && m.language === language
          );
          if (existing) {
            await base44.entities.LearningMemory.update(existing.id, {
              frequency: (existing.frequency || 1) + 1,
              last_occurrence: new Date().toISOString(),
              context: mistake.description,
            });
          } else {
            await base44.entities.LearningMemory.create({
              problem_type: mistake.problem_type || 'general',
              mistake_type: mistake.type, language,
              frequency: 1, last_occurrence: new Date().toISOString(),
              context: mistake.description, confidence_level: 'low', resolved: false,
            });
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['memories'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      return analysisResponse;
    },
    onSuccess: (data) => { setResult(data); setAnalyzeStep(0); },
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-inter font-bold text-foreground tracking-tight">Code Lab</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-powered analysis with memory context</p>
        </div>
        {memories.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/5 border border-accent/20">
            <Brain className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-accent">{memories.length} patterns in memory</span>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Left: Editor */}
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-36 bg-card/60 border-border/50 backdrop-blur-sm text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(l => (
                  <SelectItem key={l.value} value={l.value}>
                    <span className={l.color}>{l.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <motion.button
              onClick={() => analyzeMutation.mutate()}
              disabled={!code.trim() || analyzeMutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-violet-500 text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzeMutation.isPending ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" />Analyzing...</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" />Analyze Code</>
              )}
            </motion.button>
          </div>

          <CodeEditor value={code} onChange={setCode} language={language} />

          {/* Memory pills */}
          {memories.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-card/40 border border-border/30">
              <span className="text-[10px] font-semibold text-muted-foreground/60 w-full mb-0.5 flex items-center gap-1">
                <Brain className="w-3 h-3" /> Tracking topics:
              </span>
              {[...new Set(memories.map(m => m.problem_type))].slice(0, 8).map(topic => (
                <span key={topic} className="text-[10px] px-2 py-0.5 rounded-md bg-primary/8 text-primary/70 border border-primary/15 font-medium">
                  {topic}
                </span>
              ))}
            </motion.div>
          )}
        </div>

        {/* Right: Results */}
        <div>
          <AnimatePresence mode="wait">
            {analyzeMutation.isPending ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <div className="absolute -inset-2 rounded-3xl border border-primary/20 animate-ping opacity-30" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">AI Analysis in Progress</p>
                <motion.p key={analyzeStep} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-muted-foreground">
                  {ANALYZING_STEPS[analyzeStep]}
                </motion.p>
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AnalysisResult result={result} />
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl border border-dashed border-border/40 bg-card/30 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                  <Play className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">Ready to Analyze</h3>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  Paste your code on the left and click Analyze. Results will appear here with memory-aware feedback.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
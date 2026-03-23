import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, Sparkles, Trash2, Zap } from 'lucide-react';
import ChatMessage from '../components/chat/ChatMessage';

const SUGGESTED = [
  "What are my weakest topics?",
  "Help me understand dynamic programming",
  "Review patterns in my recent mistakes",
  "Suggest a 7-day practice plan",
];

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI Coding Mentor with full memory access. I can see your past mistakes, learning patterns, and track your progress. Ask me anything — I'll give you personalized guidance based on your history." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.LearningMemory.list('-created_date', 50),
  });
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.CodingSession.list('-created_date', 10),
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const memCtx = memories.length > 0
      ? memories.slice(0, 15).map(m => `- ${m.problem_type}: ${m.mistake_type} (${m.language}, ${m.frequency}x, resolved: ${m.resolved})`).join('\n')
      : 'No past mistakes yet.';
    const scoresCtx = sessions.slice(0, 5).map(s => `Score: ${s.score}/100, Language: ${s.language}`).join('\n') || 'No sessions yet.';
    const histCtx = messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an elite AI Coding Mentor with full access to the user's learning history. Be specific, personalized, and encouraging.

USER'S LEARNING MEMORY:
${memCtx}

RECENT SCORES:
${scoresCtx}

CHAT HISTORY:
${histCtx}

USER MESSAGE:
${input}

Instructions: Reference specific past mistakes when relevant ("I notice you've struggled with X before..."). Provide code examples. Suggest targeted practice. Use markdown formatting. Be concise but thorough.`,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 6rem)' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-inter font-bold text-foreground tracking-tight">AI Chat</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Memory-aware assistant · <span className="text-primary font-medium">{memories.length} patterns tracked</span>
          </p>
        </div>
        <button onClick={() => setMessages([messages[0]])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all border border-border/40">
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </motion.div>

      {/* Chat container */}
      <div className="flex-1 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm flex flex-col overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} index={i} />
            ))}

            {isLoading && (
              <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center border border-primary/20">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-secondary/40 border border-border/30">
                  <div className="flex gap-1 items-center">
                    {[0,1,2].map(i => (
                      <motion.div key={i} animate={{ scale: [1,1.4,1], opacity:[0.4,1,0.4] }}
                        transition={{ duration: 1, delay: i*0.2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">Thinking with memory...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestions */}
          {messages.length === 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-2">
              <p className="text-[11px] font-semibold text-muted-foreground/60 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-accent" /> Suggested
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((q, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setInput(q)}
                    className="text-xs px-3.5 py-2 rounded-xl border border-border/50 bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
                    {q}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Input bar */}
        <div className="shrink-0 border-t border-border/40 p-4 bg-card/30">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask about coding, algorithms, or your learning progress..."
                disabled={isLoading}
                className="w-full px-4 py-3 pr-4 rounded-xl bg-secondary/40 border border-border/50 text-foreground placeholder:text-muted-foreground/40 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all duration-200 disabled:opacity-50"
              />
            </div>
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
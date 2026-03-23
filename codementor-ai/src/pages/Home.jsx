import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Code2, BarChart3, MessageSquare, ArrowRight, Zap, Shield, Sparkles, CheckCircle2, Star } from 'lucide-react';

const features = [
  { icon: Brain, title: "Hindsight Memory", desc: "AI remembers every mistake you make and builds a personal model of your weaknesses to guide you better each session.", color: "from-violet-500/20 to-violet-500/5", iconColor: "text-violet-400" },
  { icon: Code2, title: "Smart Code Analysis", desc: "Detect logical errors, off-by-one bugs, pattern mistakes, and weak topics instantly with actionable explanations.", color: "from-sky-500/20 to-sky-500/5", iconColor: "text-sky-400" },
  { icon: BarChart3, title: "Progress Tracking", desc: "Interactive radar charts, timelines, and streak tracking show your real growth across every DSA topic.", color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
  { icon: MessageSquare, title: "Context-Aware Chat", desc: "Every AI message is personalized. It knows your history and delivers targeted advice based on your exact weak points.", color: "from-orange-500/20 to-orange-500/5", iconColor: "text-orange-400" },
];

const steps = [
  { step: "01", title: "Submit Your Code", desc: "Paste any code snippet in Python, Java, C++ or JavaScript." },
  { step: "02", title: "AI Analyzes & Remembers", desc: "Gets scored, analyzed, and your mistakes are stored in memory." },
  { step: "03", title: "Get Personalized Feedback", desc: "The AI references past mistakes in every response going forward." },
];

const stats = [
  { value: "10x", label: "Faster Learning" },
  { value: "94%", label: "Mistake Reduction" },
  { value: "∞", label: "Memory Retention" },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 md:py-32">
        {/* BG orbs */}
        <motion.div animate={{ scale: [1,1.1,1], opacity:[0.4,0.6,0.4] }} transition={{ duration:7, repeat:Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-r from-primary/25 via-accent/15 to-primary/20 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(120,80,255,0.08),transparent)] pointer-events-none" />

        <motion.div initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }} className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide">AI-Powered · Memory-Driven · Production Ready</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-inter font-black text-foreground leading-[1.05] tracking-tight">
            The AI Mentor That
            <span className="block mt-2 bg-gradient-to-r from-violet-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              Never Forgets
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            CodeMentor learns from every mistake you make. It builds a memory of your patterns and delivers hyper-personalized guidance — every single time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/code">
              <motion.button whileHover={{ scale:1.03, boxShadow:'0 0 40px rgba(120,80,255,0.4)' }} whileTap={{ scale:0.98 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-violet-500 text-white font-semibold text-base shadow-lg shadow-primary/30 transition-all duration-300">
                Start Coding Free <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link to="/dashboard">
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border/60 bg-secondary/20 hover:bg-secondary/40 text-foreground font-semibold text-base transition-all duration-300">
                View Dashboard
              </motion.button>
            </Link>
          </div>

          {/* Stats row */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            className="flex items-center justify-center gap-12 mt-16">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 md:py-24 px-4">
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="text-center mb-14">
          <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-3">Process</p>
          <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground">How It Works</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm">Three steps to a smarter coding practice</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay: i*0.12 }} className="relative">
              <div className="glass rounded-2xl p-7 h-full hover:border-primary/20 transition-all duration-300 group">
                <div className="absolute -top-3 -left-1 text-[64px] font-black text-primary/5 leading-none select-none">{s.step}</div>
                <div className="relative z-10">
                  <p className="text-xs font-bold text-primary mb-3 tracking-wider">{s.step}</p>
                  <h3 className="text-base font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-border" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 md:py-24 px-4">
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="text-center mb-14">
          <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground">Built Different</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm">Every feature is engineered to maximize your learning velocity</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i*0.1 }}
              whileHover={{ y:-3, transition:{ duration:0.2 } }}
              className="glass rounded-2xl p-7 group cursor-default relative overflow-hidden border border-border/40 hover:border-primary/20 transition-colors duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
              <div className="relative z-10">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 border border-white/5`}>
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 px-4">
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="max-w-3xl mx-auto glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden border border-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5 rounded-3xl" />
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
            </div>
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-4">
              Ready to code smarter?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of developers who've accelerated their growth with memory-driven AI feedback.
            </p>
            <Link to="/code">
              <motion.button whileHover={{ scale:1.04, boxShadow:'0 0 50px rgba(120,80,255,0.45)' }} whileTap={{ scale:0.97 }}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-violet-500 text-white font-semibold text-base shadow-2xl shadow-primary/30 transition-all duration-300">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
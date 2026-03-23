import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GlassCard({ children, className, gradient, animate = true, ...props }) {
  const Comp = animate ? motion.div : 'div';
  const animProps = animate ? {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35 }
  } : {};

  return (
    <Comp
      className={cn(
        "rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 relative overflow-hidden",
        gradient && "border-primary/15",
        className
      )}
      {...animProps}
      {...props}
    >
      {gradient && <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/3 pointer-events-none rounded-2xl" />}
      <div className="relative z-10">{children}</div>
    </Comp>
  );
}
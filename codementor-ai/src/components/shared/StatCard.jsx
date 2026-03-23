import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, trend, color = "primary", delay = 0 }) {
  const colorMap = {
    primary: "from-primary/20 to-primary/5 text-primary",
    accent: "from-accent/20 to-accent/5 text-accent",
    green: "from-green-500/20 to-green-500/5 text-green-400",
    orange: "from-orange-500/20 to-orange-500/5 text-orange-400",
    red: "from-red-500/20 to-red-500/5 text-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-2xl p-5 relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${colorMap[color]} rounded-full opacity-30 blur-2xl -translate-y-6 translate-x-6 group-hover:opacity-50 transition-opacity`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <span className={`text-xs font-semibold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}
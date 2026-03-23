import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm p-3 shadow-xl text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value ?? '—'}</p>
      ))}
    </div>
  );
};

export default function MistakeTimeline({ sessions }) {
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 13 - i));
    return { date, label: format(date, 'MMM d') };
  });

  const data = days.map(d => {
    const daySessions = sessions.filter(s => startOfDay(new Date(s.created_date)).getTime() === d.date.getTime());
    const totalMistakes = daySessions.reduce((sum, s) => sum + (s.mistakes?.length || 0), 0);
    const avgScore = daySessions.length > 0
      ? Math.round(daySessions.reduce((sum, s) => sum + (s.score || 0), 0) / daySessions.length) : null;
    return { name: d.label, Mistakes: totalMistakes, Score: avgScore };
  });

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Activity · 14 Days</p>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gMistake" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.25} />
              <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.25} />
              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
          <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="Mistakes" stroke="hsl(var(--chart-5))" fill="url(#gMistake)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="Score" stroke="hsl(var(--chart-3))" fill="url(#gScore)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
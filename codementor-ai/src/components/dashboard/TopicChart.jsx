import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

export default function TopicChart({ memories }) {
  const topicFrequency = {};
  memories.forEach(m => {
    topicFrequency[m.problem_type] = (topicFrequency[m.problem_type] || 0) + (m.frequency || 1);
  });

  const data = Object.entries(topicFrequency).map(([topic, count]) => ({
    topic: topic.length > 10 ? topic.slice(0, 10) + '…' : topic,
    mistakes: count,
    fullMark: Math.max(...Object.values(topicFrequency)) + 2,
  }));

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 h-full">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Topic Radar</p>
      {data.length === 0 ? (
        <div className="h-52 flex items-center justify-center text-sm text-muted-foreground/50">
          Submit code to see topic analysis
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <PolarAngleAxis dataKey="topic" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'Inter' }} />
            <Radar dataKey="mistakes" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
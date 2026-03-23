import React from 'react';
import { motion } from 'framer-motion';
import { Brain, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export default function ChatMessage({ message, index }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3 group", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
          <Brain className="w-3.5 h-3.5 text-primary" />
        </div>
      )}

      <div className={cn("max-w-[78%]", isUser && "flex flex-col items-end")}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-primary to-violet-600 text-white rounded-tr-sm shadow-lg shadow-primary/20"
            : "bg-secondary/50 border border-border/40 text-foreground rounded-tl-sm"
        )}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-code:text-accent prose-a:text-primary">
              <ReactMarkdown
                components={{
                  code: ({ inline, className, children, ...props }) =>
                    inline ? (
                      <code className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-mono border border-primary/15">{children}</code>
                    ) : (
                      <pre className="bg-background/80 rounded-xl p-4 overflow-x-auto my-3 border border-border/50">
                        <code className="text-xs font-mono text-foreground/90">{children}</code>
                      </pre>
                    ),
                  p: ({ children }) => <p className="my-1.5 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="my-1.5 ml-4 list-disc space-y-0.5">{children}</ul>,
                  ol: ({ children }) => <ol className="my-1.5 ml-4 list-decimal space-y-0.5">{children}</ol>,
                  li: ({ children }) => <li className="text-foreground/85">{children}</li>,
                  strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                  h3: ({ children }) => <h3 className="text-sm font-bold text-foreground mt-3 mb-1">{children}</h3>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-secondary/60 border border-border/40 flex items-center justify-center shrink-0 mt-0.5">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
}
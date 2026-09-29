'use client';

import type { ChatEventArgs, ChatUIMessage } from '@reddit-clone/shared';
import { Brain, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MessagesProps = {
  messages: ChatUIMessage[];
  events: ChatEventArgs[];
  isStreaming: boolean;
};

export default function Messages({ messages, events, isStreaming }: MessagesProps) {
  const visibleEvents = isStreaming ? events.filter((event) => event.state !== 'think') : events;

  return (
    <div className="flex flex-col gap-5 p-4">
      {messages.map((message) => {
        const isUser = message.role === 'user';
        const isStreamingAssistant =
          isStreaming && !isUser && message.id === messages.at(-1)?.id;

        return (
          <div
            key={message.id}
            className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={
                isUser ? 'max-w-[85%] rounded-2xl bg-input px-4 py-3' : 'w-full max-w-none'
              }
            >
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <div
                      key={`${part.type}-${index}`}
                      className="prose dark:prose-invert max-w-none"
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className={isStreamingAssistant ? 'shimmer' : undefined}>
                              {children}
                            </p>
                          ),
                          li: ({ children }) => (
                            <li className={isStreamingAssistant ? 'shimmer' : undefined}>
                              {children}
                            </li>
                          ),
                          h1: ({ children }) => (
                            <h1 className={isStreamingAssistant ? 'shimmer' : undefined}>
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className={isStreamingAssistant ? 'shimmer' : undefined}>
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className={isStreamingAssistant ? 'shimmer' : undefined}>
                              {children}
                            </h3>
                          ),
                        }}
                      >
                        {part.text}
                      </ReactMarkdown>
                    </div>
                  );
                }

                if (part.type === 'reasoning') {
                  if (!part.text.trim()) return null;

                  return (
                    <ReasoningPart
                      key={`${part.type}-${index}`}
                      text={part.text}
                      isStreaming={isStreamingAssistant}
                    />
                  );
                }

                if (part.type.startsWith('tool-')) {
                  return (
                    <p key={`${part.type}-${index}`} className="text-sm text-muted-foreground">
                      Tool: {part.type.slice('tool-'.length)}
                    </p>
                  );
                }

                return null;
              })}
            </div>
          </div>
        );
      })}
      {visibleEvents.map((event, index) => (
        <div key={`event-${index}`} className="flex w-full justify-start">
          <p className="shimmer text-muted-foreground" role="status">
            {event.response}
          </p>
        </div>
      ))}
    </div>
  );
}

function ReasoningPart({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-3 w-fit max-w-full overflow-hidden rounded-xl border border-border/70 bg-muted/40">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-xs font-medium text-muted-foreground"
      >
        <span className="flex items-center gap-2">
          <Brain className="size-3.5" />
          <span className={isStreaming ? 'shimmer' : undefined}>Reasoning</span>
        </span>
        <ChevronDown
          className={`size-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-border/70 px-4 py-3">
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className={isStreaming ? 'shimmer' : undefined}>{children}</p>
                ),
                li: ({ children }) => (
                  <li className={isStreaming ? 'shimmer' : undefined}>{children}</li>
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </section>
  );
}

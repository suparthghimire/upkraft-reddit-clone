import React from 'react';
import { ChatEvent, ChatUIMessage } from '../types';
import { cn } from 'cn';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Brain, ChevronDown } from 'lucide-react';

function MessagesList(props: {
  messages: ChatUIMessage[];
  events: ChatEvent[];
  isStreaming: boolean;
}) {
  const { messages, events, isStreaming } = props;
  const visibleEvents = isStreaming ? events.filter((event) => event.state !== 'think') : events;
  return (
    <div className="flex flex-col gap-5 p-4">
      {visibleEvents.map((event, eventIndex) => (
        <div key={`event-${eventIndex}`} className="flex w-full justify-start">
          <div className="shimmer text-muted-foreground text-xs">{event.response}</div>
        </div>
      ))}
      {messages.map((message) => {
        const isUser = message.role === 'user';

        return (
          <div
            className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}
            key={message.id}
          >
            <div
              className={cn(
                isUser
                  ? 'max-w-[85%] flex flex-col rounded-2xl px-4 bg-input py-3'
                  : 'w-full max-w-none',
              )}
            >
              {message.parts.map((part, partIndex) => {
                if (part.type === 'text')
                  return (
                    <div
                      key={`${part.type}-${partIndex}`}
                      className="prose dark:prose-invert max-w-none"
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
                    </div>
                  );
                if (part.type === 'reasoning')
                  return (
                    <div key={`${part.type}-${partIndex}`} className="mb-2">
                      <Reasoning
                        isStreaming={isStreaming}
                        text={part.text}
                        key={`${part.type}-${partIndex}`}
                      />
                    </div>
                  );
                if (part.type.startsWith('tool-')) return <></>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Reasoning({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  const [expanded, setExpanded] = React.useState(false);

  if (text.trim().length <= 0) return null;

  return (
    <section className="max-w-full overflow-hidden rounded-xl border border-border bg-muted/40">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-start gap-4 px-4 py-3 text-left text-xs font-medium text-muted-foreground"
      >
        <span className="flex items-center gap-2">
          <Brain className="shimmer size-3.5" />
          <span className={cn(isStreaming ? 'shimmer' : '')}>Reasoning</span>
        </span>
        <ChevronDown
          className={cn('size-3.5 shrink-0 transition-transform', expanded ? 'rotate-180' : '')}
        />
      </button>
      {expanded ? (
        <div className="border-t border-border px-4 py-3">
          <div
            className={cn(
              'prose prose-sm dark:prose-invert max-w-none text-muted-foreground',
              isStreaming ? 'shimmer' : '',
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default MessagesList;

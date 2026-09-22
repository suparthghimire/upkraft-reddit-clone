'use client';

import { env } from '@/env.mjs';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea as TextArea } from '@/components/ui/textarea';
import type { ChatModel } from '@reddit-clone/shared';
import { ArrowUp, CircleStop, Database, Loader2, Sparkles } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ChatState = 'think' | 'tool' | 'response' | 'message';

type ChatEvent = {
  state: ChatState;
  response: string;
  titles?: string[];
};

type StreamPart = {
  type: string;
  data?: unknown;
  delta?: unknown;
  errorText?: unknown;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

type ChatFormValues = {
  message: string;
};

const DEFAULT_MODEL: ChatModel = 'gemini-3.6-flash';

const MODEL_OPTIONS: ReadonlyArray<{ value: ChatModel; label: string }> = [
  { value: 'gemini-3.6-flash', label: 'Gemini Flash' },
  { value: 'gpt-4.1-nano', label: 'GPT-4.1 nano' },
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function parseSseBlock(block: string): StreamPart | null {
  const data = block
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim())
    .join('');

  if (!data || data === '[DONE]') return null;

  try {
    return JSON.parse(data) as StreamPart;
  } catch {
    return null;
  }
}

async function getHttpErrorMessage(response: Response) {
  const fallback = `The assistant request failed (${response.status}).`;

  try {
    const body = await response.text();
    if (!body) return fallback;

    const parsed = JSON.parse(body) as { message?: unknown };
    return typeof parsed.message === 'string' && parsed.message ? parsed.message : fallback;
  } catch {
    return fallback;
  }
}

function isChatEvent(value: unknown): value is ChatEvent {
  if (!value || typeof value !== 'object') return false;

  const event = value as Partial<ChatEvent>;
  return (
    (event.state === 'think' ||
      event.state === 'tool' ||
      event.state === 'response' ||
      event.state === 'message') &&
    typeof event.response === 'string'
  );
}

async function consumeChatStream(
  response: Response,
  onPart: (part: StreamPart) => void,
  signal: AbortSignal,
) {
  if (!response.body) throw new Error('The server did not return a stream.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });

      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() ?? '';

      for (const block of blocks) {
        const part = parseSseBlock(block);
        if (part) onPart(part);
      }

      if (done) break;
      if (signal.aborted) throw new DOMException('The request was cancelled.', 'AbortError');
    }

    const finalPart = parseSseBlock(buffer);
    if (finalPart) onPart(finalPart);
  } finally {
    reader.releaseLock();
  }
}

export default function DashboardChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [model, setModel] = useState<ChatModel>(DEFAULT_MODEL);
  const [mockMode, setMockMode] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeEvent, setActiveEvent] = useState<ChatEvent | null>(null);
  const [activityVisible, setActivityVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    formState: { errors: formErrors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<ChatFormValues>({
    defaultValues: { message: '' },
  });
  const input = watch('message');
  const messageField = register('message', {
    validate: (value) => value.trim().length > 0 || 'Message is required',
  });

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 208)}px`;
  }, [input]);

  useEffect(
    () => () => {
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const scrollContainer = chatScrollRef.current;
    if (!scrollContainer) return;

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: isStreaming ? 'auto' : 'smooth',
    });
  }, [isStreaming, messages]);

  function showActivity(event: ChatEvent) {
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
      activityTimerRef.current = null;
    }

    const shouldAnimateIn = activeEvent === null;
    setActiveEvent(event);

    if (shouldAnimateIn) {
      setActivityVisible(false);
      requestAnimationFrame(() => setActivityVisible(true));
    } else {
      setActivityVisible(true);
    }
  }

  function hideActivity() {
    setActivityVisible(false);

    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    activityTimerRef.current = setTimeout(() => {
      setActiveEvent(null);
      activityTimerRef.current = null;
    }, 240);
  }

  async function submitMessage({ message: rawMessage }: ChatFormValues) {
    const message = rawMessage.trim();
    if (!message || isStreaming) return;

    const userMessage: ChatMessage = { id: createId(), role: 'user', text: message };
    const assistantId = createId();

    reset({ message: '' });
    setError(null);
    setIsStreaming(true);
    showActivity({
      state: 'think',
      response: 'Attempting to search the knowledge base',
    });
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: 'assistant', text: '' },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const streamUrl = `${env.NEXT_PUBLIC_BASE_SERVER_API_ENDPOINT}/v1/chat/stream${
        mockMode ? '?mock=true' : ''
      }`;

      const response = await fetch(streamUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message, model }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(await getHttpErrorMessage(response));
      }

      await consumeChatStream(
        response,
        (part) => {
          if (part.type === 'data-event' && isChatEvent(part.data)) {
            if (part.data.state !== 'message') showActivity(part.data);
            return;
          }

          if (part.type === 'text-delta' && typeof part.delta === 'string') {
            hideActivity();
            setMessages((current) =>
              current.map((chatMessage) =>
                chatMessage.id === assistantId
                  ? { ...chatMessage, text: chatMessage.text + part.delta }
                  : chatMessage,
              ),
            );
            return;
          }

          if (part.type === 'error') {
            hideActivity();
            throw new Error(
              typeof part.errorText === 'string' ? part.errorText : 'The assistant stream failed.',
            );
          }
        },
        controller.signal,
      );
    } catch (streamError) {
      if (streamError instanceof DOMException && streamError.name === 'AbortError') return;

      setError(streamError instanceof Error ? streamError.message : 'The assistant stream failed.');
    } finally {
      abortRef.current = null;
      setIsStreaming(false);
      hideActivity();
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit(submitMessage)();
    }
  }

  function stopStreaming() {
    abortRef.current?.abort();
  }

  return (
    <main className="flex h-[calc(100dvh-4rem)] min-h-0 overflow-hidden bg-[#f5f4ef] text-[#20211f]">
      <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div ref={chatScrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-8 sm:px-7 sm:py-12">
              {messages.length === 0 ? (
                <div className="flex flex-1 flex-col justify-center pb-12">
                  <div className="grid size-12 place-items-center rounded-2xl bg-[#20211f] text-[#f5f4ef] shadow-[0_12px_30px_rgba(32,33,31,0.18)]">
                    <Sparkles className="size-5" aria-hidden="true" />
                  </div>
                  <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#ee5a2f]">
                    Knowledge assistant
                  </p>
                  <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl">
                    Ask your knowledge base anything.
                  </h1>
                  <p className="mt-5 max-w-xl text-sm leading-6 text-black/50 sm:text-base">
                    Search across your blog posts and get a grounded answer with the assistant.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2 text-xs text-black/55">
                    {['How do stars form?', 'Search AI posts', 'Explain natural resources'].map(
                      (suggestion) => (
                        <Button
                          key={suggestion}
                          type="button"
                          onClick={() =>
                            setValue('message', suggestion, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                          variant="outline"
                          size="sm"
                          className="rounded-full border-black/10 bg-white/70 px-3.5 py-2 transition hover:border-black/20 hover:bg-white"
                        >
                          {suggestion}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-8 pb-8">
                  {messages
                    .filter((message) => message.role === 'user' || message.text.length > 0)
                    .map((message) => (
                      <article key={message.id} className="flex gap-3.5">
                        <div
                          className={`grid size-8 shrink-0 place-items-center rounded-xl text-xs font-bold ${
                            message.role === 'user'
                              ? 'bg-[#e4e2dc] text-[#20211f]'
                              : 'bg-[#20211f] text-[#f5f4ef]'
                          }`}
                        >
                          {message.role === 'user' ? 'You' : <Sparkles className="size-4" />}
                        </div>
                        <div className="min-w-0 flex-1 pt-1">
                          <p className="mb-1 text-xs font-semibold text-black/45">
                            {message.role === 'user' ? 'You' : 'Assistant'}
                          </p>
                          <div className="text-[15px] leading-7 tracking-[-0.01em] text-[#292a27]">
                            {message.role === 'assistant' ? (
                              <div className="prose prose-neutral max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {message.text}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap">{message.text}</p>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-black/6 bg-[#f5f4ef]/95 px-4 pb-4 pt-3 backdrop-blur-xl sm:px-7 sm:pb-6">
            <div className="mx-auto w-full max-w-3xl">
              {error ? (
                <FieldError
                  errors={[{ message: error }]}
                  className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
                />
              ) : null}

              <div className="relative">
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-[calc(100%+0.2rem)] z-0 origin-bottom transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    activityVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                  }`}
                  aria-live="polite"
                >
                  {activeEvent && (
                    <div className="rounded-2xl border border-black/8 bg-white/90 px-3.5 py-3 shadow-[0_8px_24px_rgba(42,37,28,0.08)] backdrop-blur-xl">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-[#20211f] text-[#f5f4ef]">
                          {activeEvent.state === 'tool' ? (
                            <Database className="size-3.5" aria-hidden="true" />
                          ) : (
                            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/35">
                            {activeEvent.state === 'tool' ? 'Knowledge base' : 'Thinking'}
                          </p>
                          <p className="mt-1 text-xs font-medium text-black/65">
                            {activeEvent.response}
                          </p>
                          {activeEvent.titles?.length ? (
                            <div className="mt-2 space-y-1">
                              {activeEvent.titles.map((title) => (
                                <p key={title} className="truncate text-[11px] text-black/40">
                                  {title}
                                </p>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit(submitMessage)}
                  className="relative z-10 rounded-2xl border border-black/12 bg-white p-2 shadow-[0_10px_35px_rgba(42,37,28,0.08)]"
                >
                  <Field className="gap-0">
                    <FieldLabel htmlFor="chat-message" className="sr-only">
                      Message
                    </FieldLabel>
                    <TextArea
                      id="chat-message"
                      {...messageField}
                      ref={(element) => {
                        messageField.ref(element);
                        textareaRef.current = element;
                      }}
                      onKeyDown={handleInputKeyDown}
                      placeholder="Ask anything about your knowledge base..."
                      className="max-h-52 min-h-16 border-0 bg-transparent px-3 py-2 text-sm leading-6 shadow-none outline-none placeholder:text-black/35 focus-visible:border-0 focus-visible:ring-0"
                      disabled={isStreaming}
                      aria-label="Message"
                    />
                    <FieldError
                      errors={formErrors.message ? [formErrors.message] : []}
                      className="px-3"
                    />
                  </Field>
                  <div className="flex flex-wrap items-center gap-2 border-t border-black/6 px-2 pt-2">
                    <Field orientation="horizontal" className="w-auto items-center gap-1.5">
                      <FieldLabel
                        htmlFor="chat-model"
                        className="w-auto text-[10px] font-semibold uppercase tracking-[0.1em] text-black/35"
                      >
                        Model
                      </FieldLabel>
                      <Select
                        value={model}
                        onValueChange={(value) => setModel(value as ChatModel)}
                        disabled={isStreaming}
                      >
                        <SelectTrigger
                          id="chat-model"
                          aria-label="Choose the language model"
                          className="w-[7.5rem]"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MODEL_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field orientation="horizontal" className="w-auto items-center gap-1.5">
                      <Switch
                        id="chat-mock"
                        checked={mockMode}
                        onCheckedChange={setMockMode}
                        disabled={isStreaming}
                        aria-label="Use mock stream"
                      />
                      <FieldLabel htmlFor="chat-mock" className="w-auto text-[11px] text-black/55">
                        Mock
                      </FieldLabel>
                    </Field>

                    <div className="ml-auto">
                      {isStreaming ? (
                        <Button
                          type="button"
                          onClick={stopStreaming}
                          size="icon-lg"
                          className="rounded-xl bg-[#20211f] text-[#f5f4ef] transition hover:bg-black/75"
                          aria-label="Stop response"
                        >
                          <CircleStop className="size-4" aria-hidden="true" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={!input.trim()}
                          size="icon-lg"
                          className="rounded-xl bg-[#20211f] text-[#f5f4ef] transition hover:bg-[#ee5a2f] disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Send message"
                        >
                          <ArrowUp className="size-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
              <p className="mt-2 text-center text-[10px] text-black/30">
                Enter to send · Shift + Enter for a new line ·{' '}
                {mockMode ? 'Mock mode is enabled' : 'Live model mode'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

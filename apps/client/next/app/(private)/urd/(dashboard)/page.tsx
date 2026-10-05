'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ai, chatMessageSchema, ChatMessageSchema } from '@reddit-clone/shared';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from './_components/text-input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { ChatEvent, ChatUIMessage } from './types';
import MessagesList from './_components/messages-list';
import EmptyMessages from './_components/empty-messages';

function DashboardPage() {
  const [events, setEvents] = useState<ChatEvent[]>([]);
  const { sendMessage, messages, status } = useChat<ChatUIMessage>({
    transport: new ai.DefaultChatTransport({
      api: '/api/v1/chat/stream',
      credentials: 'include',
    }),
    onData(part) {
      if (part.type === 'data-event') {
        setEvents((prev) => [...prev, part.data]);
      }
    },
    onFinish() {
      setEvents([]);
    },
    onError(err) {
      console.error('Chat error occurred', err);
      setEvents([]);
    },
  });

  const form = useForm<ChatMessageSchema>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      message: '',
      provider: 'openai',
      model: 'gpt-5.6-luna',
      reasoning: 'low',
    },
  });

  const isChatBusy = status === 'submitted' || status === 'streaming';

  function handleSubmit(data: ChatMessageSchema) {
    if (isChatBusy) return;
    sendMessage({ text: data.message }, { body: data });
    form.setValue('message', '');
  }

  return (
    <div className="relative w-full mx-auto h-[calc(100dvh-65px)] min-h-0 max-w-6xl flex flex-col items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <ScrollArea className="min-h-0 w-full flex-1">
        {messages.length === 0 ? (
          <EmptyMessages
            handleClick={(message) => {
              form.setValue('message', message);
            }}
          />
        ) : (
          <MessagesList isStreaming={status === 'streaming'} messages={messages} events={events} />
        )}
      </ScrollArea>
      {/* Messages list */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="h-40 w-full shrink-0">
          <TextInput />
        </form>
      </FormProvider>
      {/* Text input */}
    </div>
  );
}

export default DashboardPage;

'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  chatMessageSchema,
  type ChatEventArgs,
  type ChatMessageInput,
  type ChatMessageSchema,
  type ChatUIMessage,
  ai,
} from '@reddit-clone/shared';
import { useChat } from '@ai-sdk/react';
import { env } from '@/env.mjs';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Messages from './_components/messages';
import TextInput from './_components/text-input';

function DashboardPage() {
  const [events, setEvents] = useState<ChatEventArgs[]>([]);

  const { messages, sendMessage, status } = useChat<ChatUIMessage>({
    transport: new ai.DefaultChatTransport({
      api: `${env.NEXT_PUBLIC_BASE_SERVER_API_ENDPOINT}/v1/chat/stream`,
      credentials: 'include',
    }),
    onData: (part) => {
      if (part.type === 'data-event') {
        setEvents((currentEvents) => [...currentEvents, part.data]);
      }
    },
    onFinish: () => setEvents([]),
    onError: (error) => {
      console.error('Chat error:', error);
      setEvents([]);
    },
  });

  const isChatBusy = status === 'submitted' || status === 'streaming';
  const chatMessageForm = useForm<ChatMessageInput, unknown, ChatMessageSchema>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      message: '',
      model: 'gpt-5.6-luna',
      provider: 'openai',
      reasoning: 'low',
    },
  });

  function handleSendMessage(data: ChatMessageSchema) {
    if (isChatBusy) return;

    setEvents([]);
    sendMessage({ text: data.message }, { body: data });
  }

  return (
    <div className="relative mx-auto flex h-[calc(100dvh-65px)] min-h-0 w-full max-w-6xl flex-col items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <ScrollArea className="min-h-0 w-full flex-1">
        <Messages messages={messages} events={events} isStreaming={status === 'streaming'} />
      </ScrollArea>
      <FormProvider {...chatMessageForm}>
        <form
          onSubmit={chatMessageForm.handleSubmit(handleSendMessage)}
          className="h-40 w-full shrink-0"
        >
          <TextInput isChatBusy={isChatBusy} />
        </form>
      </FormProvider>
    </div>
  );
}

export default DashboardPage;

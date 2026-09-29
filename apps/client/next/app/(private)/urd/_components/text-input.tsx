'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  type AvailableModel,
  type ChatMessageInput,
  type ChatMessageSchema,
  ModelToProviderMap,
} from '@reddit-clone/shared';
import { ArrowUp } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

export default function TextInput({ isChatBusy }: { isChatBusy: boolean }) {
  const chatMessageForm = useFormContext<ChatMessageInput, unknown, ChatMessageSchema>();

  return (
    <div className="relative flex size-full flex-col gap-2">
      <Controller
        control={chatMessageForm.control}
        name="message"
        render={({ field }) => (
          <div className="flex size-full flex-col gap-2">
            <Textarea
              placeholder="Ask anything"
              className="size-full"
              {...field}
              onKeyDown={(event) => {
                if (event.ctrlKey && event.key === 'Enter') {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />
          </div>
        )}
      />
      <div className="absolute bottom-3 flex w-full items-center gap-2 px-3">
        <Controller
          control={chatMessageForm.control}
          name="model"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                const provider = ModelToProviderMap[value as AvailableModel];
                chatMessageForm.setValue('provider', provider);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-5.6-luna">gpt-5.6-luna</SelectItem>
                <SelectItem value="gpt-6.1-luna">gpt-6.1-luna</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Button
          type="submit"
          size="icon"
          className="ml-auto rounded-full"
          disabled={isChatBusy}
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
}

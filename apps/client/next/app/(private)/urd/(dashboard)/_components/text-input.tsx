import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessageSchema, ModelToProviderMap } from '@reddit-clone/shared';
import { ArrowUp } from 'lucide-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function TextInput() {
  const chatMessageForm = useFormContext<ChatMessageSchema>();

  return (
    <div className="relative size-full">
      <Controller
        control={chatMessageForm.control}
        name="message"
        render={({ field }) => (
          <Textarea {...field} placeholder="Ask a question..." className="bg-input size-full" />
        )}
      />
      <div className="flex items-center gap-2 w-full absolute bottom-4 px-4">
        <Controller
          control={chatMessageForm.control}
          name="model"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(v) => {
                field.onChange(v);

                chatMessageForm.setValue(
                  'provider',
                  ModelToProviderMap[v as 'gpt-5.6-luna' | 'gpt-6-luna'],
                );
              }}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-5.6-luna">gpt-5.6-luna</SelectItem>
                <SelectItem value="gpt-6.1-luna">gpt-6.1-luna</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Button size="icon" type="submit" className="ml-auto">
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
}

export default TextInput;

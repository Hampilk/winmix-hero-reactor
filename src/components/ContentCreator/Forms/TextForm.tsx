
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface TextFormProps {
  onSubmit: (data: { content: string }) => void;
  initialData?: { content: string };
}

export const TextForm: React.FC<TextFormProps> = ({ onSubmit, initialData }) => {
  const form = useForm<{ content: string }>({
    defaultValues: initialData || { content: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Szöveg tartalom</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Írja be a szöveget..." 
                  className="min-h-[150px] bg-gray-800 border-gray-700 text-white" 
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Tartalom hozzáadása</Button>
      </form>
    </Form>
  );
};

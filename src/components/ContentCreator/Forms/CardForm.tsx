
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CardFormProps {
  onSubmit: (data: { title: string; content: string; imageUrl?: string }) => void;
  initialData?: { title: string; content: string; imageUrl?: string };
}

export const CardForm: React.FC<CardFormProps> = ({ onSubmit, initialData }) => {
  const form = useForm<{ title: string; content: string; imageUrl?: string }>({
    defaultValues: initialData || { title: '', content: '', imageUrl: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Kártya címe</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Kártya címe" 
                  className="bg-gray-800 border-gray-700 text-white" 
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Kártya tartalma</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Kártya tartalma..." 
                  className="min-h-[100px] bg-gray-800 border-gray-700 text-white" 
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Kép URL (opcionális)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="https://pelda.hu/kep.jpg" 
                  className="bg-gray-800 border-gray-700 text-white" 
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Kártya hozzáadása</Button>
      </form>
    </Form>
  );
};

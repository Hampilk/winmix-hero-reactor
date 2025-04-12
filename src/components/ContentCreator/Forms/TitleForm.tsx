
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TitleFormProps {
  onSubmit: (data: { content: string; level: 1 | 2 | 3 | 4 | 5 | 6 }) => void;
  initialData?: { content: string; level: 1 | 2 | 3 | 4 | 5 | 6 };
}

export const TitleForm: React.FC<TitleFormProps> = ({ onSubmit, initialData }) => {
  const form = useForm<{ content: string; level: 1 | 2 | 3 | 4 | 5 | 6 }>({
    defaultValues: initialData || { content: '', level: 2 },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Cím szövege</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Írja be a cím szövegét..." 
                  className="bg-gray-800 border-gray-700 text-white" 
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Cím szintje</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6)} 
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Válasszon címszintet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="1">H1 - Nagyon nagy</SelectItem>
                  <SelectItem value="2">H2 - Nagy</SelectItem>
                  <SelectItem value="3">H3 - Közepes</SelectItem>
                  <SelectItem value="4">H4 - Kisebb</SelectItem>
                  <SelectItem value="5">H5 - Kicsi</SelectItem>
                  <SelectItem value="6">H6 - Nagyon kicsi</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Cím hozzáadása</Button>
      </form>
    </Form>
  );
};

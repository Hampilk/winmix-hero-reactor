
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ButtonFormProps {
  onSubmit: (data: { text: string; url: string; variant?: 'default' | 'outline' | 'secondary' }) => void;
  initialData?: { text: string; url: string; variant?: 'default' | 'outline' | 'secondary' };
}

export const ButtonForm: React.FC<ButtonFormProps> = ({ onSubmit, initialData }) => {
  const form = useForm<{ text: string; url: string; variant: 'default' | 'outline' | 'secondary' }>({
    defaultValues: initialData || { text: '', url: '', variant: 'default' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Gomb szövege</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Kattintson ide" 
                  className="bg-gray-800 border-gray-700 text-white" 
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Cél URL</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="https://pelda.hu" 
                  className="bg-gray-800 border-gray-700 text-white" 
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="variant"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Gomb stílusa</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(value as 'default' | 'outline' | 'secondary')} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Válasszon stílust" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="default">Alapértelmezett</SelectItem>
                  <SelectItem value="outline">Körvonal</SelectItem>
                  <SelectItem value="secondary">Másodlagos</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Gomb hozzáadása</Button>
      </form>
    </Form>
  );
};

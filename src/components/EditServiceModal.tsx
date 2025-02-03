import { useEffect } from 'react';
import { Service } from '@/types/service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name ist erforderlich'),
  description: z.string().optional(),
  duration: z.coerce.number().min(1, 'Dauer muss mindestens 1 Minute sein'),
  price: z.coerce.number().min(0, 'Preis muss positiv sein'),
  category: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface EditServiceModalProps {
  service: Service | null;
  onClose: () => void;
  onSave: (service: ServiceFormData) => void;
}

export default function EditServiceModal({ service, onClose, onSave }: EditServiceModalProps) {
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      duration: 0,
      price: 0,
      category: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        id: service.id,
        name: service.name,
        description: service.description || '',
        duration: Number(service.duration),
        price: Number(service.price),
        category: service.category || '',
        is_active: service.is_active,
      });
    }
  }, [service, form]);

  const onSubmit = (data: ServiceFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {service ? 'Service bearbeiten' : 'Neuer Service'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Service Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschreibung</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Beschreibung des Services" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorie</FormLabel>
                  <FormControl>
                    <Input placeholder="Kategorie" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dauer (Min)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preis (€)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Aktiv</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={onClose}>
                Abbrechen
              </Button>
              <Button type="submit">
                {service ? 'Speichern' : 'Erstellen'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" }
  });

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    console.log("Contact form submitted:", values);
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you soon.",
    });
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Contact Us</h1>
        <p className="mt-2 text-lg text-muted-foreground">We'd love to hear from you. Here's how you can reach us.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full"><Mail className="h-6 w-6" /></div>
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="text-muted-foreground">support@shopsphere.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full"><Phone className="h-6 w-6" /></div>
            <div>
              <h3 className="font-semibold text-lg">Phone</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full"><MapPin className="h-6 w-6" /></div>
            <div>
              <h3 className="font-semibold text-lg">Address</h3>
              <p className="text-muted-foreground">123 Commerce St, Online City, 10101</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill out the form below and we will get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="Your Email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl><Textarea placeholder="How can we help?" rows={6} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Send Message</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

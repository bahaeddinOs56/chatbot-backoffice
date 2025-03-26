"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { settingsApi } from "@/lib/api";

const formSchema = z.object({
  botName: z.string().min(1, "Bot name is required"),
  welcomeMessage: z.string().min(1, "Welcome message is required"),
  fallbackMessage: z.string().min(1, "Fallback message is required"),
});

export function GeneralSettingsForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      botName: "",
      welcomeMessage: "",
      fallbackMessage: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await settingsApi.updateGeneral(values);
      toast({ title: "Success", description: "General settings updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update general settings." });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="botName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bot Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter bot name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="welcomeMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Welcome Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter welcome message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fallbackMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fallback Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter fallback message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/lib/hooks/use-settings";
import { useEffect } from "react";
import { AppearanceSettings } from "@/types/qa";

// Define the form schema to match the actual AppearanceSettings interface
const formSchema = z.object({
  primary_color: z.string().min(1, "Primary color is required"),
  logo_url: z.string().url("Invalid URL"),
  dark_mode: z.boolean(),
  position: z.enum(["bottom-right", "bottom-left", "top-right", "top-left"]),
});

type FormValues = z.infer<typeof formSchema>;

export function AppearanceSettingsForm() {
  const { toast } = useToast();
  const { settings, loading, updateSettings } = useSettings();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primary_color: "#000000",
      logo_url: "",
      dark_mode: false,
      position: "bottom-right",
    },
  });

  // Reset form values when settings are fetched
  useEffect(() => {
    if (settings) {
      form.reset({
        primary_color: settings.primary_color || "#000000",
        logo_url: settings.logo_url || "",
        dark_mode: settings.dark_mode || false,
        position: settings.position || "bottom-right",
      });
    }
  }, [settings, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateSettings(values);
      toast({ title: "Success", description: "Appearance settings updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update appearance settings." });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Primary Color */}
        <FormField
          control={form.control}
          name="primary_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logo URL */}
        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter logo URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dark Mode */}
        <FormField
          control={form.control}
          name="dark_mode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <FormLabel>Dark Mode</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Widget Position */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Widget Position</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Save Button */}
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}

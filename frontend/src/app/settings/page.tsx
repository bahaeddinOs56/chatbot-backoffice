import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { AppearanceSettingsForm } from "./appearance-settings-form"
import { LanguageSettingsForm } from "./language-settings-form"
import { DashboardLayout } from "../components/dashboard-layout"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <AppearanceSettingsForm />
          </TabsContent>

          <TabsContent value="language">
            <LanguageSettingsForm />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}


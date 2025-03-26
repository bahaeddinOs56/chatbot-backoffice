"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { MessageSquare, FileQuestion, Mail } from "lucide-react"
import { useToast } from "@/app/components/ui/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function HelpPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChatting, setIsChatting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Support ticket submitted",
        description: "We've received your request and will get back to you within 24 hours.",
      })

      // Reset form
      e.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const startLiveChat = async () => {
    setIsChatting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Live chat initiated",
        description: "Connecting you with a support agent...",
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Unable to connect to live chat. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsChatting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-semibold mb-6">Help & Support</h1>

        <Tabs defaultValue="faq" className="w-full max-w-3xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">
              <FileQuestion className="mr-2 h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="mr-2 h-4 w-4" />
              Live Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">How do I create a new chatbot?</h3>
                    <p className="text-muted-foreground mt-1">
                      Navigate to the Chatbots section and click the "New Chatbot" button. Follow the setup wizard to
                      configure your chatbot.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">How do I integrate my chatbot with my website?</h3>
                    <p className="text-muted-foreground mt-1">
                      After creating your chatbot, go to the Integration tab and copy the provided script. Paste this
                      script into your website's HTML.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Can I customize the appearance of my chatbot?</h3>
                    <p className="text-muted-foreground mt-1">
                      Yes, you can customize colors, fonts, and the chat window size in the Appearance settings of your
                      chatbot.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">How do I train my chatbot with custom data?</h3>
                    <p className="text-muted-foreground mt-1">
                      Go to the Training section and upload your documents or enter custom Q&A pairs to train your
                      chatbot.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="Your email" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="Brief description of your issue" required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Describe your issue in detail"
                      required
                    ></textarea>
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Ticket"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <MessageSquare className="mx-auto h-12 w-12 text-primary" />
                  <h3 className="text-xl font-medium">Start a Live Chat Session</h3>
                  <p className="text-muted-foreground">
                    Connect with our support team instantly. Our agents are available Monday to Friday, 9am to 5pm EST.
                  </p>
                  <Button onClick={startLiveChat} disabled={isChatting} className="mx-auto">
                    {isChatting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Start Live Chat
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}


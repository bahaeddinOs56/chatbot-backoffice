"use client"

import { useState, useCallback } from "react"
import api from "@/lib/api"

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface UseChatOptions {
  initialGreeting?: string
  endpoint?: string
}

export function useChat({
  initialGreeting = "Hello! How can I help you today?",
  endpoint = "/api/qa",
}: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Set initial greeting when chat is first opened
  const initializeChat = useCallback(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          content: initialGreeting,
          isUser: false,
          timestamp: new Date(),
        },
      ])
    }
  }, [initialGreeting, messages.length])

  const sendMessage = useCallback(
    async (messageContent: string) => {
      if (!messageContent.trim()) return

      // Add user message to chat
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: messageContent,
        isUser: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        // Send message to backend API
        const response = await api.post(endpoint, {
          question: messageContent,
        })

        // Add bot response to chat
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          content: response.data.answer || "I'm sorry, I couldn't find an answer to that.",
          isUser: false,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
        return botMessage
      } catch (error) {
        console.error("Error sending message:", error)

        // Add error message
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          content: "Sorry, I'm having trouble connecting right now. Please try again later.",
          isUser: false,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, errorMessage])
        return errorMessage
      } finally {
        setIsLoading(false)
      }
    },
    [endpoint],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    initializeChat,
  }
}


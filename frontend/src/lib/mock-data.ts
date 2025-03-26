import type { QA, Category } from "@/types/qa"

export const categories: Category[] = [
  { id: "1", name: "General", description: "General questions about the service" },
  { id: "2", name: "Account", description: "Account-related questions" },
  { id: "3", name: "Pricing", description: "Questions about pricing and plans" },
  { id: "4", name: "Technical", description: "Technical support questions" },
]

export const qaData: QA[] = [
  {
    id: "1",
    question: "What is your name?",
    answer: "I am your AI assistant, designed to help with your questions and tasks.",
    category_id: "1",
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    question: "How do I reset my password?",
    answer:
      'To reset your password, go to the login page and click on "Forgot Password". Follow the instructions sent to your email.',
    category_id: "2",
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    question: "What are your business hours?",
    answer: "Our customer support is available Monday to Friday, 9 AM to 5 PM Eastern Time.",
    category_id: "1",
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    question: "How much does the premium plan cost?",
    answer:
      "Our premium plan costs $29.99 per month, billed monthly, or $299 per year, saving you two months when billed annually.",
    category_id: "3",
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    question: "How do I integrate the chatbot with my website?",
    answer:
      "To integrate our chatbot with your website, copy the provided script tag from your dashboard and paste it before the closing </body> tag in your HTML.",
    category_id: "4",
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]


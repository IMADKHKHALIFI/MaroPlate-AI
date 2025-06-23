"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useGalleryStore } from "@/lib/store/gallery-store"
import { geminiChat, ChatMessage } from "@/lib/api/gemini-api"
import { useToast } from "@/hooks/use-toast"

export function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [galleryCount, setGalleryCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  
  const galleryItems = useGalleryStore((state) => state.items)

  useEffect(() => {
    setGalleryCount(galleryItems.length)
  }, [galleryItems])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message
    const newUserMessage: ChatMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newUserMessage])

    try {
      // Get response from Gemini
      const response = await geminiChat.analyzeGalleryPlates(galleryItems, userMessage)
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de contacter l'assistant IA",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        role: "assistant",
        content: `Bonjour! Je suis votre assistant IA spécialisé dans les plaques d'immatriculation marocaines. J'ai accès à ${galleryCount} plaque(s) dans votre galerie.\n\nJe peux vous aider à :\n• Analyser les plaques détectées\n• Expliquer les codes de région\n• Interpréter les lettres arabes\n• Donner des statistiques sur vos détections\n\nPosez-moi une question !`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }

  const suggestedQuestions = [
    "Quelles sont les régions les plus représentées dans ma galerie ?",
    "Combien de véhicules privés ai-je détectés ?",
    "Explique-moi les codes de région marocains",
    "Quelles sont les lettres arabes et leur signification ?",
    "Analyse les tendances dans mes détections"
  ]

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
            isOpen 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
        
        {/* Notification badge */}
        {!isOpen && galleryCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-green-500 text-xs font-bold text-white flex items-center justify-center">
            {galleryCount > 99 ? "99+" : galleryCount}
          </Badge>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] z-40 glass-card-dark border-white/20 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-sm">Assistant IA</CardTitle>
                  <p className="text-xs text-gray-400">Plaques Marocaines</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs border-green-400 text-green-400">
                {galleryCount} plaque(s)
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[400px]">
            {/* Messages Area */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-2",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-[280px] rounded-lg px-3 py-2 text-sm",
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-gray-800 border border-gray-700 text-gray-100"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                    
                    {message.role === "user" && (
                      <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>            </ScrollArea>
            
            {/* Suggested Questions - Show only if no messages except welcome */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-2">Questions suggérées :</p>
                <div className="space-y-1">
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full text-left justify-start text-xs text-gray-300 hover:text-white hover:bg-white/10 h-auto py-1 px-2"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez une question sur les plaques..."
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

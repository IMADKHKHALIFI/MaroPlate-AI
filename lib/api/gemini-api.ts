"use client"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { GalleryItem } from "@/lib/store/gallery-store"

// Get API key - try multiple sources
const getAPIKey = () => {
  const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  const fallbackKey = "AIzaSyDzcMOQy88yVjdEOBSwJlfk9cEHIJCZXYw"
  
  console.log("Environment API Key:", envKey ? "Found" : "Not found")
  return envKey || fallbackKey
}

const API_KEY = getAPIKey()
console.log("Using API Key:", API_KEY ? "Available" : "Missing")

let genAI: GoogleGenerativeAI
try {
  genAI = new GoogleGenerativeAI(API_KEY)
  console.log("GoogleGenerativeAI initialized successfully")
} catch (error) {
  console.error("Failed to initialize GoogleGenerativeAI:", error)
  throw error
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export class GeminiChatAPI {
  private model: any
  private chatHistory: ChatMessage[] = []

  constructor() {
    // List of model names to try in order of preference
    const modelNamesToTry = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.5-flash-latest",
      "models/gemini-1.5-flash",
      "models/gemini-pro"
    ]
    
    // Use the first model in the list for now
    console.log("Initializing with model: gemini-1.5-flash")
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  }
  async analyzeGalleryPlates(galleryItems: GalleryItem[], userQuestion: string): Promise<string> {
    console.log("=== Gemini API Call Debug ===")
    console.log("API Key available:", API_KEY ? "Yes" : "No")
    console.log("API Key first 10 chars:", API_KEY ? API_KEY.substring(0, 10) + "..." : "None")
    console.log("Gallery items count:", galleryItems.length)
    console.log("User question:", userQuestion)
    
    try {
      // Prepare context about the plates
      const platesSummary = this.generatePlatesSummary(galleryItems)
      console.log("Plates summary generated:", platesSummary.length, "characters")
      
      const prompt = `Tu es un assistant expert en plaques d'immatriculation marocaines.

${platesSummary}

Question: ${userQuestion}

Réponds en français de manière claire et utile. Si aucune plaque n'est disponible, explique les caractéristiques générales des plaques marocaines.`

      console.log("Sending request to Gemini with model: gemini-1.5-flash")
      
      // Try with different model configurations if the first fails
      let result
      try {
        result = await this.model.generateContent(prompt)
      } catch (modelError: any) {
        console.log("First model failed, trying with gemini-pro...")
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" })
        result = await fallbackModel.generateContent(prompt)
      }
      
      console.log("Gemini response received")
      
      const response = await result.response
      const text = response.text()
      
      console.log("Response text length:", text.length)

      // Add to chat history
      this.chatHistory.push(
        { role: "user", content: userQuestion, timestamp: new Date() },
        { role: "assistant", content: text, timestamp: new Date() }
      )

      return text} catch (error: any) {
      console.error("=== Gemini API Error ===")
      console.error("Error type:", error?.constructor?.name || "Unknown")
      console.error("Error message:", error?.message || error)
      console.error("Full error:", error)
      
      // Return a more specific error message
      const errorMessage = error?.message || String(error)
      if (errorMessage.includes("API_KEY") || errorMessage.includes("API key")) {
        return "Erreur : Clé API invalide. Veuillez vérifier la configuration."
      } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
        return "Erreur : Quota API dépassé. Veuillez réessayer plus tard."
      } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        return "Erreur de connexion. Vérifiez votre connexion internet."
      } else if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        return "Erreur : Modèle IA non disponible. Le service est temporairement indisponible."
      } else {
        return `Erreur technique : ${errorMessage}. Veuillez réessayer.`
      }
    }
  }

  private generatePlatesSummary(galleryItems: GalleryItem[]): string {
    if (galleryItems.length === 0) {
      return "Aucune plaque détectée dans la galerie."
    }

    let summary = `Nombre total de plaques : ${galleryItems.length}\n\n`
    
    galleryItems.forEach((item, index) => {
      const parts = item.plateNumber.split(" | ")
      const plateNumber = parts[0] || "N/A"
      const arabicLetter = parts[1] || "N/A"
      const regionCode = parts[2] || "N/A"
      
      summary += `${index + 1}. Plaque: ${plateNumber}\n`
      summary += `   - Lettre arabe: ${arabicLetter}\n`
      summary += `   - Code région: ${regionCode}\n`
      summary += `   - Confiance: ${item.confidence}%\n`
      summary += `   - Date: ${item.datetime}\n`
      summary += `   - Statut: ${item.status}\n`
      summary += `   - Tags: ${item.tags.join(", ")}\n\n`
    })

    return summary
  }

  getChatHistory(): ChatMessage[] {
    return this.chatHistory
  }

  clearHistory(): void {
    this.chatHistory = []
  }
}

export const geminiChat = new GeminiChatAPI()

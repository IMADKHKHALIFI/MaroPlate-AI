"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface GalleryItem {
  id: string
  thumbnail: string
  plateNumber: string
  confidence: number
  datetime: string
  modelName: string
  tags: string[]
  status: string
  isFavorite: boolean
  originalImage?: string
  detectionImage?: string
  ocrResult?: any
  processingTime?: number // Processing time in seconds
}

interface GalleryStore {
  items: GalleryItem[]
  addItem: (item: Omit<GalleryItem, "id" | "datetime" | "isFavorite">) => void
  toggleFavorite: (id: string) => void
  removeItem: (id: string) => void
  getItemById: (id: string) => GalleryItem | undefined
}

export const useGalleryStore = create<GalleryStore>()(
  persist(
    (set, get) => ({
      items: [
        // Keep some initial mock data
        {
          id: "mock-1",
          thumbnail: "/placeholder.svg?height=200&width=300",
          plateNumber: "90120 | ي | 72",
          confidence: 98.5,
          datetime: "2024-01-15 14:30:25",
          modelName: "YOLOv3",
          tags: ["commercial", "Casablanca"],
          status: "Analysé",
          isFavorite: true,
          processingTime: 1.2, // seconds
        },
        {
          id: "mock-2",
          thumbnail: "/placeholder.svg?height=200&width=300",
          plateNumber: "45678 | ب | 10",
          confidence: 94.2,
          datetime: "2024-01-15 13:45:12",
          modelName: "YOLOv3",
          tags: ["private", "Rabat"],
          status: "Analysé",
          isFavorite: false,
          processingTime: 0.8, // seconds
        },
      ],

      addItem: (item) => {
        const newItem: GalleryItem = {
          ...item,
          id: `detection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          datetime: new Date().toLocaleString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          isFavorite: false,
          processingTime: item.processingTime || Math.random() * 2 + 0.5, // Default random time between 0.5-2.5s
        }

        set((state) => ({
          items: [newItem, ...state.items],
        }))
      },

      toggleFavorite: (id) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
        }))
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      getItemById: (id) => {
        return get().items.find((item) => item.id === id)
      },
    }),
    {
      name: "gallery-storage",
    },
  ),
)

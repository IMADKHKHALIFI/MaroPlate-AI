"use client"

import { create } from "zustand"

interface DetectionState {
  originalImage: string | null
  detectionResult: string | null
  ocrResult: any | null
  isProcessing: boolean
  plateImages: string[]
  uploadId: string | null
}

interface DetectionStore extends DetectionState {
  setDetectionState: (state: Partial<DetectionState>) => void
  resetDetection: () => void
  setImageForReanalysis: (imageData: string, plateNumber?: string) => void
}

const initialState: DetectionState = {
  originalImage: null,
  detectionResult: null,
  ocrResult: null,
  isProcessing: false,
  plateImages: [],
  uploadId: null,
}

export const useDetectionStore = create<DetectionStore>((set) => ({
  ...initialState,

  setDetectionState: (newState) => {
    set((state) => ({ ...state, ...newState }))
  },

  resetDetection: () => {
    set(initialState)
  },

  setImageForReanalysis: (imageData, plateNumber) => {
    set({
      ...initialState,
      originalImage: imageData,
      // Store the plate number for reference if needed
      uploadId: plateNumber ? `reanalysis-${plateNumber}` : "reanalysis",
    })
  },
}))

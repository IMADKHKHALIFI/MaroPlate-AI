"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DetectionControlPanel } from "@/components/detection-control-panel"
import { ImageResultCard } from "@/components/image-result-card"
import { OcrResultDisplay } from "@/components/ocr-result-display"

export default function DetectionPage() {
  const [detectionState, setDetectionState] = useState({
    originalImage: null,
    detectionResult: null,
    ocrResult: null,
    isProcessing: false,
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Header title="AI Detection" subtitle="Upload images or videos for real-time license plate detection" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Control Panel */}
        <div className="space-y-4">
          <DetectionControlPanel onStateChange={setDetectionState} isProcessing={detectionState.isProcessing} />
        </div>

        {/* Detection Results */}
        <div className="space-y-4">
          <ImageResultCard
            title="Original Image"
            image={detectionState.originalImage}
            isProcessing={detectionState.isProcessing}
          />
          <ImageResultCard
            title="Detection Result"
            image={detectionState.detectionResult}
            isProcessing={detectionState.isProcessing}
            showBoundingBox
          />
        </div>
      </div>

      {/* OCR Results */}
      {detectionState.ocrResult && <OcrResultDisplay result={detectionState.ocrResult} />}
    </div>
  )
}

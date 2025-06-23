// API service for Flask backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface DetectionResult {
  id: string
  plateNumber: string
  confidence: number
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  segmentation: Array<{
    character: string
    confidence: number
    position: { x: number; y: number; width: number; height: number }
  }>
  region: {
    code: string
    name: string
  }
  arabicLetter: string
}

export interface FlaskDetectionResponse {
  status: string
  original_image: string
  detection_image: string
  detection: Array<{
    plate_index: number
    plate_image: string
  }>
}

export interface FlaskOCRResponse {
  status: string
  plate_text: string
  segmented_image: string
}

export interface UploadResponse {
  id: string
  filename: string
  status: "uploaded" | "processing" | "completed" | "error"
}

export interface MetricsData {
  detection: {
    accuracy: number
    precision: number
    recall: number
    f1_score: number
    fps: number
    confusion_matrix: number[][]
    roc_curve: {
      fpr: number[]
      tpr: number[]
      auc: number
    }
    processing_times: number[]
  }
  ocr: {
    accuracy: number
    precision: number
    recall: number
    f1_score: number
    character_accuracy: number
    processing_times: number[]
  }
}

export interface HistoryItem {
  id: string
  thumbnail: string
  plateNumber: string
  confidence: number
  timestamp: string
  modelName: string
  tags: string[]
}

export interface DashboardStats {
  totalDetections: {
    value: number
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
  }
  averageAccuracy: {
    value: number
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
  }
  averageTime: {
    value: number
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
  }
  successRate: {
    value: number
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
  }
}

class PlateAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request("/health")
  }

  async uploadImage(file: File): Promise<FlaskDetectionResponse> {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch(`${API_BASE_URL}/detect`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return response.json()
  }

  async uploadVideo(file: File): Promise<{
    status: string
    detection_image?: string
    original_image?: string
    plate_images?: string[]
  }> {
    const formData = new FormData()
    formData.append("video", file)

    const response = await fetch(`${API_BASE_URL}/upload_video`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Video upload failed: ${response.statusText}`)
    }

    return response.json()
  }

  async performOCR(plateImageBase64: string, lang = "eng"): Promise<FlaskOCRResponse> {
    return this.request("/ocr", {
      method: "POST",
      body: JSON.stringify({
        plate_image: plateImageBase64,
        lang: lang,
      }),
    })
  }

  async performOCRWithFile(file: File, lang = "eng"): Promise<FlaskOCRResponse> {
    const formData = new FormData()
    formData.append("plate_image", file)
    formData.append("lang", lang)

    const response = await fetch(`${API_BASE_URL}/ocr`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`OCR failed: ${response.statusText}`)
    }

    return response.json()
  }

  async fetchMetrics(): Promise<MetricsData> {
    return this.request("/api/metrics")
  }

  async fetchHistory(filters?: {
    search?: string
    model?: string
    dateFrom?: string
    dateTo?: string
    limit?: number
  }): Promise<HistoryItem[]> {
    // Mock implementation for now - you can extend this based on your backend
    const mockHistory: HistoryItem[] = [
      {
        id: "1",
        thumbnail:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
        plateNumber: "90120 | 72 | ي",
        confidence: 96.8,
        timestamp: "2024-01-15 14:30:25",
        modelName: "YOLOv3",
        tags: ["commercial", "Casablanca"],
      },
    ]
    return Promise.resolve(mockHistory)
  }

  async fetchDashboardStats(): Promise<DashboardStats> {
    try {
      return this.request("/api/dashboard-stats")
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn("Dashboard stats API not available, using mock data:", error)
      return this.getMockDashboardStats()
    }
  }

  private getMockDashboardStats(): DashboardStats {
    // Generate realistic mock data with some randomization
    const baseDetections = 2500 + Math.floor(Math.random() * 500)
    const baseAccuracy = 82 + Math.random() * 8
    const baseTime = 1.0 + Math.random() * 0.5
    const baseSuccess = 94 + Math.random() * 4

    return {
      totalDetections: {
        value: baseDetections,
        change: `+${(Math.random() * 20 + 5).toFixed(1)}%`,
        changeType: 'positive'
      },
      averageAccuracy: {
        value: Math.round(baseAccuracy * 10) / 10,
        change: `+${(Math.random() * 3 + 0.5).toFixed(1)}%`,
        changeType: 'positive'
      },
      averageTime: {
        value: Math.round(baseTime * 10) / 10,
        change: `-${(Math.random() * 0.5 + 0.1).toFixed(1)}s`,
        changeType: 'positive'
      },
      successRate: {
        value: Math.round(baseSuccess * 10) / 10,
        change: `+${(Math.random() * 2 + 0.5).toFixed(1)}%`,
        changeType: 'positive'
      }
    }
  }

  // Helper method to convert base64 to File for OCR
  base64ToFile(base64String: string, filename = "plate.jpg"): File {
    const arr = base64String.split(",")
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg"
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  // Parse Moroccan plate text into structured format
  parsePlateText(plateText: string): {
    plateNumber: string
    regionCode: string
    arabicLetter: string
    regionName: string
  } {
    // Parse format like "90120 | ي | 72" (plateNumber | arabicLetter | regionCode)
    const parts = plateText.split(" | ")

    // Updated comprehensive region mapping
    const regionMap: Record<string, string> = {
      "1": "Rabat",
      "2": "Salé-Médina",
      "3": "Sala Al-Jadida",
      "4": "Skhirat-Temara",
      "5": "Khémisset",
      "6": "Casablanca Anfa",
      "7": "Casablanca Hay Mohammadi-Aïn Sebaâ",
      "8": "Casablanca Hay Hassani",
      "9": "Casablanca Benmsik",
      "10": "Casablanca Moulay Rachid",
      "11": "Casablanca-Al Fida Derb Sultan",
      "12": "Casablanca Mechouar",
      "13": "Casablanca Sidi Bernoussi-Zenata",
      "14": "Mohammedia",
      "15": "Fès jdid - dar dbibagh",
      "16": "Fès Medina",
      "17": "Zouagha - Moulay Yacoub",
      "18": "Sefrou",
      "19": "Boulmane",
      "20": "Meknès Menzah",
      "21": "Meknès Ismailia",
      "22": "El Hajeb",
      "23": "Ifrane",
      "24": "Khénifra",
      "25": "Errachidia",
      "26": "Marrakech-Menara",
      "27": "Marrakech-Medina",
      "28": "Marrakech-Sidi Youssef Ben-Ali",
      "29": "El-Haouz",
      "30": "Chichaoua",
      "31": "Kelâat Es-Sraghna",
      "32": "Essaouira",
      "33": "Agadir Ida-Outanane",
      "34": "Agadir - Inezgane - Ait Melloul",
      "35": "Chtouka Aït Baha",
      "36": "Taroudant",
      "37": "Tiznit",
      "38": "Ouarzazate",
      "39": "Zagora",
      "40": "Tangier - Asilah",
      "41": "Tanger Fahs-Bni Makada",
      "42": "Larache",
      "43": "Chefchaouen",
      "44": "Tétouan",
      "45": "Al-Hoceima",
      "46": "Taza",
      "47": "Taounate",
      "48": "Oujda",
      "49": "Berkane",
      "50": "Nador",
      "51": "Taourirt",
      "52": "Jerada",
      "53": "Figuig",
      "54": "Asfi",
      "55": "El Jadida",
      "56": "Settat",
      "57": "Khouribga",
      "58": "Benslimane",
      "59": "Kénitra",
      "60": "Sidi Kacem",
      "61": "Béni Mellal",
      "62": "Azilal",
      "63": "Smara",
      "64": "Guelmim",
      "65": "Tan-Tan",
      "66": "Tata",
      "67": "Assa-Zag",
      "68": "Laâyoune",
      "69": "Boujdour",
      "70": "Oued Ed-Dahab",
      "71": "Aousserd",
      "72": "Casablanca Ain-Chock",
      "73": "Casablanca Nouacer",
      "74": "Casablanca Mediouna",
      "75": "M'diq - Fnideq",
      "76": "Driouch",
      "77": "Guercif",
      "78": "Ouazzane",
      "79": "Sidi Slimane",
      "80": "Midelt",
      "81": "Berrechid",
      "82": "Sidi Bennour",
      "83": "Ben Guerir",
      "84": "Fquih Ben Salah",
      "85": "Youssoufia",
      "86": "Tinghir",
      "87": "Sidi Ifni",
      "88": "Tarfaya",
      "89": "Lagouira",
    }

    // Handle the corrected format: plateNumber | arabicLetter | regionCode
    const plateNumber = parts[0] || ""
    const arabicLetter = parts[1] || ""
    const regionCode = parts[2] || ""

    return {
      plateNumber: plateNumber,
      regionCode: regionCode,
      arabicLetter: arabicLetter,
      regionName: regionMap[regionCode] || "Région inconnue",
    }
  }
}

export const plateAPI = new PlateAPI()

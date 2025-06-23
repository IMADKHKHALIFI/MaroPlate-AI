"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GeoInfoBanner } from "@/components/geo-info-banner"
import { Copy, MapPin, Hash, Type, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OcrResultDisplayProps {
  result: {
    plateNumber: string
    regionCode: string
    arabicLetter: string
    regionName: string
    confidence: number
    segmentation: Array<{
      character: string
      confidence: number
    }>
  }
}

export function OcrResultDisplay({ result }: OcrResultDisplayProps) {
  const { toast } = useToast()
  const [ocrProgress, setOcrProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(true)
  const [showResults, setShowResults] = useState(false)

  // Mapping from region code to region name
  const regionMap: Record<string, string> = {
    '1': 'Rabat',
    '2': 'Salé-Médina',
    '3': 'Sala Al-Jadida',
    '4': 'Skhirat-Temara',
    '5': 'Khémisset',
    '6': 'Casablanca Anfa',
    '7': 'Casablanca Hay Mohammadi-Aïn Sebaâ',
    '8': 'Casablanca Hay Hassani',
    '9': 'Casablanca Benmsik',
    '10': 'Casablanca Moulay Rachid',
    '11': 'Casablanca-Al Fida Derb Sultan',
    '12': 'Casablanca Mechouar',
    '13': 'Casablanca Sidi Bernoussi-Zenata',
    '14': 'Mohammedia',
    '15': 'Fès jdid - dar dbibagh',
    '16': 'Fès Medina',
    '17': 'Zouagha - Moulay Yacoub',
    '18': 'Sefrou',
    '19': 'Boulmane',
    '20': 'Meknès Menzah',
    '21': 'Meknès Ismailia',
    '22': 'El Hajeb',
    '23': 'Ifrane',
    '24': 'Khénifra',
    '25': 'Errachidia',
    '26': 'Marrakech-Menara',
    '27': 'Marrakech-Medina',
    '28': 'Marrakech-Sidi Youssef Ben-Ali',
    '29': 'El-Haouz',
    '30': 'Chichaoua',
    '31': 'Kelâat Es-Sraghna',
    '32': 'Essaouira',
    '33': 'Agadir Ida-Outanane',
    '34': 'Agadir - Inezgane - Ait Melloul',
    '35': 'Chtouka Aït Baha',
    '36': 'Taroudant',
    '37': 'Tiznit',
    '38': 'Ouarzazate',
    '39': 'Zagora',
    '40': 'Tangier - Asilah',
    '41': 'Tanger Fahs-Bni Makada',
    '42': 'Larache',
    '43': 'Chefchaouen',
    '44': 'Tétouan',
    '45': 'Al-Hoceima',
    '46': 'Taza',
    '47': 'Taounate',
    '48': 'Oujda',
    '49': 'Berkane',
    '50': 'Nador',
    '51': 'Taourirt',
    '52': 'Jerada',
    '53': 'Figuig',
    '54': 'Asfi',
    '55': 'El Jadida',
    '56': 'Settat',
    '57': 'Khouribga',
    '58': 'Benslimane',
    '59': 'Kénitra',
    '60': 'Sidi Kacem',
    '61': 'Béni Mellal',
    '62': 'Azilal',
    '63': 'Smara',
    '64': 'Guelmim',
    '65': 'Tan-Tan',
    '66': 'Tata',
    '67': 'Assa-Zag',
    '68': 'Laâyoune',
    '69': 'Boujdour',
    '70': 'Oued Ed-Dahab',
    '71': 'Aousserd',
    '72': 'Casablanca Ain-Chock',
    '73': 'Casablanca Nouacer',
    '74': 'Casablanca Mediouna',
    '75': "M'diq - Fnideq",
    '76': 'Driouch',
    '77': 'Guercif',
    '78': 'Ouazzane',
    '79': 'Sidi Slimane',
    '80': 'Midelt',
    '81': 'Berrechid',
    '82': 'Sidi Bennour',
    '83': 'Ben Guerir',
    '84': 'Fquih Ben Salah',
    '85': 'Youssoufia',
    '86': 'Tinghir',
    '87': 'Sidi Ifni',
    '88': 'Tarfaya',
    '89': 'Lagouira',
  }

  // Get the actual region name from the mapping
  const getRegionName = (regionCode: string): string => {
    return regionMap[regionCode] || result.regionName || 'Région inconnue'
  }

  const steps = [
    { name: "Extraction", icon: "🔍", color: "green" },
    { name: "Segmentation", icon: "✂️", color: "red" },
    { name: "Reconnaissance", icon: "🔤", color: "purple" },
    { name: "Terminé", icon: "✅", color: "green" },
  ]

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setOcrProgress((prev) => {
          const newProgress = prev + Math.random() * 15 + 5

          // Update current step based on progress
          if (newProgress >= 25 && currentStep < 1) setCurrentStep(1)
          if (newProgress >= 50 && currentStep < 2) setCurrentStep(2)
          if (newProgress >= 75 && currentStep < 3) setCurrentStep(3)

          if (newProgress >= 100) {
            setIsProcessing(false)
            setTimeout(() => setShowResults(true), 500)
            clearInterval(interval)
            return 100
          }

          return newProgress
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [isProcessing, currentStep])

  const handleCopyResult = () => {
    const fullPlate = `${result.plateNumber} | ${result.arabicLetter} | ${result.regionCode}`
    navigator.clipboard.writeText(fullPlate)
    toast({
      title: "Copié dans le presse-papiers",
      description: "Informations de la plaque copiées",
    })
  }

  return (
    <div className="space-y-6">
      {/* OCR Processing Steps - Only show while processing */}
      {isProcessing && (
        <Card className="glass-card-dark border-white/10 animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400 animate-spin" />
              <CardTitle className="text-white">Traitement OCR en Cours</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">🔍 Reconnaissance OCR...</span>
                <span className="text-sm text-blue-400">{Math.round(ocrProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 progress-blue rounded-full transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.name}
                  className={`glass-card p-4 rounded-xl border transition-all duration-500 ${
                    index <= currentStep ? `border-${step.color}-400/50 bg-${step.color}-400/10` : "border-gray-600/30"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg mb-2 ${
                      index <= currentStep ? `bg-${step.color}-400/20` : "bg-gray-600/20"
                    }`}
                  >
                    <span className={index <= currentStep ? `text-${step.color}-400` : "text-gray-500"}>
                      {step.icon}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${index <= currentStep ? "text-white" : "text-gray-500"}`}>
                    {step.name}
                  </p>
                  {index === currentStep && isProcessing && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-600 rounded-full h-1">
                        <div className="h-1 bg-blue-400 rounded-full animate-pulse" style={{ width: "60%" }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <div className="inline-block bg-white/10 rounded-lg px-6 py-3 animate-pulse">
                <span className="text-2xl font-bold text-gray-400">Analyse en cours...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results - Only show when processing is complete */}
      {showResults && (
        <div className="space-y-6 animate-slide-up">
          {/* Segmentation View */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card-dark border-white/10">
              <CardHeader>
                <CardTitle className="text-white">🔵 Plaque Originale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="bg-white rounded-lg px-6 py-3">
                    <span className="text-2xl font-bold text-black">
                      {result.plateNumber} | {result.arabicLetter} | {result.regionCode}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-white/10">
              <CardHeader>
                <CardTitle className="text-white">🟣 Segmentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="flex gap-2 items-center">
                    {/* Display the complete plate: numbers | arabic letter | region code */}
                    <div className="flex gap-1">
                      {result.plateNumber.split("").map((char, index) => (
                        <div
                          key={`number-${index}`}
                          className="w-8 h-10 rounded flex items-center justify-center text-white font-bold animate-scale-in bg-green-500"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {char}
                        </div>
                      ))}
                    </div>

                    <div
                      className="w-8 h-10 rounded flex items-center justify-center text-white font-bold animate-scale-in bg-gray-500"
                      style={{ animationDelay: `${result.plateNumber.length * 100}ms` }}
                    >
                      |
                    </div>

                    <div
                      className="w-8 h-10 rounded flex items-center justify-center text-white font-bold animate-scale-in bg-purple-500"
                      style={{ animationDelay: `${(result.plateNumber.length + 1) * 100}ms` }}
                    >
                      {result.regionCode}
                    </div>

                    <div
                      className="w-8 h-10 rounded flex items-center justify-center text-white font-bold animate-scale-in bg-gray-500"
                      style={{ animationDelay: `${(result.plateNumber.length + 2) * 100}ms` }}
                    >
                      |
                    </div>

                    <div className="flex gap-1">
                      {result.arabicLetter.split("").map((char, index) => (
                        <div
                          key={`region-${index}`}
                          className="w-8 h-10 rounded flex items-center justify-center text-white font-bold animate-scale-in bg-blue-500"
                          style={{ animationDelay: `${(result.plateNumber.length + 3 + index) * 100}ms` }}
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recognized Plate Display */}
          <Card className="glass-card-dark border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">🟠 Résultat OCR</CardTitle>
              <Button onClick={handleCopyResult} className="gradient-orange text-white border-0 hover-lift">
                <Copy className="h-4 w-4 mr-2" />
                Copier le résultat
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                {/* Large Plate Display */}
                <div className="text-6xl font-bold font-mono tracking-wider p-8 bg-gray-800 rounded-lg text-orange-400 animate-scale-in">
                  {result.plateNumber} | {result.arabicLetter} | {result.regionCode}
                </div>
                <p className="text-gray-400">
                  Plaque d'immatriculation reconnue avec {result.confidence}% de confiance
                </p>

                {/* Info Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="glass-card border-blue-400/30 animate-slide-up" style={{ animationDelay: "200ms" }}>
                    <CardContent className="flex items-center space-x-3 p-4">
                      <Hash className="h-8 w-8 text-blue-400" />
                      <div>
                        <p className="text-sm text-blue-400">NUMÉRO</p>
                        <p className="text-xl font-bold text-white">{result.plateNumber}</p>
                      </div>
                    </CardContent>
                  </Card>                  <Card
                    className="glass-card border-purple-400/30 animate-slide-up"
                    style={{ animationDelay: "400ms" }}
                  >
                    <CardContent className="flex items-center space-x-3 p-4">
                      <MapPin className="h-8 w-8 text-purple-400" />
                      <div>
                        <p className="text-sm text-purple-400">RÉGION</p>
                        <p className="text-xl font-bold text-white">{result.regionCode}</p>
                        <p className="text-xs text-gray-400">{getRegionName(result.regionCode)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-green-400/30 animate-slide-up" style={{ animationDelay: "600ms" }}>
                    <CardContent className="flex items-center space-x-3 p-4">
                      <Type className="h-8 w-8 text-green-400" />
                      <div>
                        <p className="text-sm text-green-400">LETTRE</p>
                        <p className="text-xl font-bold text-white">{result.arabicLetter}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>          {/* Geographic Information */}
          <div className="animate-fade-in" style={{ animationDelay: "800ms" }}>
            <GeoInfoBanner regionName={getRegionName(result.regionCode)} regionCode={result.regionCode} country="Royaume du Maroc" />
          </div>
        </div>
      )}
    </div>
  )
}

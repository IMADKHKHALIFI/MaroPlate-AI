import { MapPin } from "lucide-react"

interface GeoInfoBannerProps {
  regionName: string
  regionCode: string
  country: string
}

export function GeoInfoBanner({ regionName, regionCode, country }: GeoInfoBannerProps) {
  return (
    <div className="gradient-purple p-6 rounded-2xl">
      <div className="flex items-center space-x-3 mb-3">
        <MapPin className="h-6 w-6 text-white" />
        <h3 className="text-xl font-bold text-white">🌍 Informations Géographiques</h3>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{regionName}</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="opacity-80 text-white">Région</p>
            <p className="font-semibold text-white">{regionName}</p>
          </div>
          <div>
            <p className="opacity-80 text-white">Code Région</p>
            <p className="font-semibold text-white">{regionCode}</p>
          </div>
          <div>
            <p className="opacity-80 text-white">Pays</p>
            <p className="font-semibold text-white">{country}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

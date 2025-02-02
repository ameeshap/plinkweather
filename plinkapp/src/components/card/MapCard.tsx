import React, { useEffect, useState } from 'react'
// need to do pnpm install with these components
import { LayersControl, MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression } from 'leaflet'

const apiKey = process.env.OPENWEATHER_API_KEY
const temperatureLayer = 'temp_new'
const precipitationLayer = 'precipitation_new'
const cloudLayer = 'clouds_new'
const windspeed = 'wind_new'

const tempUrl = `https://tile.openweathermap.org/map/${temperatureLayer}/{z}/{x}/{y}.png?appid=${apiKey}`
const precipUrl = `https://tile.openweathermap.org/map/${precipitationLayer}/{z}/{x}/{y}.png?appid=${apiKey}`
const cloudUrl = `https://tile.openweathermap.org/map/${cloudLayer}/{z}/{x}/{y}.png?appid=${apiKey}`
const windspeedUrl = `https://tile.openweathermap.org/map/${windspeed}/{z}/{x}/{y}.png?appid=${apiKey}`

const { BaseLayer, Overlay } = LayersControl

interface MapPositionProps {
  coords: LatLngExpression
}

function SetMapPosition({ coords }: MapPositionProps) {
  const map = useMap()

  useEffect(() => {
    if (coords) {
      map.setView(coords, 13)
    }
  }, [coords, map])

  return null
}

interface MapCardProps {
  height: string
  width: string
  borderR: string

  top: number | string
  z: string
}

const MapCard: React.FC<MapCardProps> = ({
  height,
  width,
  borderR,
  z,
  top,
}) => {
  const [userLocation, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log(latitude, longitude)

          setLocation({ latitude, longitude })
        },
        (error) => {
          console.error('Error getting geolocation: ', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  const defaultCoords: LatLngExpression = [41.4993, -81.6944]
  const coords: LatLngExpression = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : defaultCoords

  return (
    <div className="MapCard">
      <MapContainer
        center={coords || [41.4993, -81.6944]}
        zoom={13}
        scrollWheelZoom={false}
        style={{
          height: height,
          width: width,
          borderRadius: borderR,
          top: top,
          zIndex: z,
        }}
      >
        {coords && <SetMapPosition coords={coords} />}
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <Overlay checked name="Air Temperature">
            <TileLayer
              attribution='<a href="https://openweathermap.org/">OpenWeather</a>'
              url={tempUrl}
            />
          </Overlay>
          <Overlay checked name="Precipitation">
            <TileLayer
              attribution='<a href="https://openweathermap.org/">OpenWeather</a>'
              url={precipUrl}
            />
          </Overlay>
          <Overlay checked name="Clouds">
            <TileLayer
              attribution='<a href="https://openweathermap.org/">OpenWeather</a>'
              url={cloudUrl}
            />
          </Overlay>
          <Overlay checked name="Windspeed">
            <TileLayer
              attribution='<a href="https://openweathermap.org/">OpenWeather</a>'
              url={windspeedUrl}
            />
          </Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  )
}

export default MapCard

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HourlyForecastFront, { Hour } from './HourlyForecast'
import weatherIcons from './weatherIcons'

const HourlyWeather: React.FC = () => {
  const [hours, setHours] = useState<Hour[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            fetchWeatherData(latitude, longitude)
          },
          (err) => {
            setError(err.message)
            setLoading(false)
          }
        )
      } else {
        setError('Geolocation is not supported by this browser.')
        setLoading(false)
      }
    }

    getLocation()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return <HourlyForecastFront hours={hours} />
}

export default HourlyWeather

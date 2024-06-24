import React, { useState, useEffect } from 'react'
import axios from 'axios'

import weatherIcons from './weatherIcons'
import WeeklyForecastFront, {
  WeatherDay,
} from '@/components/WeeklyForecastFront'

const WeeklyWeather: React.FC = () => {
  const [forecast, setDays] = useState<WeatherDay[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeatherData = async (latitude: number, longitude: number) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=8&units=imperial&appid=925cea5983a4d4da4ea3ffa502d82252`
        )

        const transformedData: WeatherDay[] = []

        for (let i = 1; i < 8; i++) {
          transformedData.push({
            day: new Date(response.data.list[i].dt * 1000).toLocaleDateString(
              'en-US',
              { weekday: 'long' }
            ),
            mintemp: Math.floor(response.data.list[i].temp.min),
            maxtemp: Math.floor(response.data.list[i].temp.max),
            precipitation: weatherIcons.get(
              response.data.list[i].weather[0].id
            ) as string,
            rainchance: response.data.list[i].rain || 0,
          })
        }

        setDays(transformedData)
        setLoading(false)
      } catch (error) {
        setError('Failed to fetch weather data')
        setLoading(false)
      }
    }

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

  return <WeeklyForecastFront forecast={forecast} />
}

export default WeeklyWeather

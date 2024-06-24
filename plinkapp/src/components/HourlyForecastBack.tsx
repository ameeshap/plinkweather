import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HourlyForecastFront, { Hour } from './HourlyForecastFront'
import { weatherIcons } from './store'

const HourlyWeather: React.FC = () => {
  const [hours, setHours] = useState<Hour[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeatherData = async (latitude: number, longitude: number) => {
      try {
        const response = await axios.get(
          `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${latitude}&lon=${longitude}&cnt=24&units=imperial&appid=925cea5983a4d4da4ea3ffa502d82252`
        )

        const transformedData: Hour[] = []

        for (let i = 0; i < 24; i++) {
          transformedData.push({
            time: new Date(response.data.list[i].dt * 1000).toLocaleTimeString(
              [],
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            ),
            temp: response.data.list[i].main.temp,
            windspeed: response.data.list[i].wind.speed,
            precipitation: weatherIcons.get(
              response.data.list[i].weather[0].id
            ) as string,
          })
        }

        setHours(transformedData)
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

  return <HourlyForecastFront hours={hours} />
}

export default HourlyWeather

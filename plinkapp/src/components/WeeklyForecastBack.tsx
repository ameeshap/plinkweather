import React, { useState, useEffect } from 'react'
import axios from 'axios'
import WeeklyForecastFront, {
  WeatherDay,
} from '@/components/WeeklyForecastFront'

const WeeklyWeather: React.FC = () => {
  const [forecast, setDays] = useState<WeatherDay[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const dataStructure = new Map()
  dataStructure.set(201, '../src/assets/cloud_lightning_heavyrain.svg')
  dataStructure.set(202, '../src/assets/cloud_lightning_heavyrain.svg')
  dataStructure.set(211, '../src/assets/cloud_lightning_heavyrain.svg')
  dataStructure.set(212, '../src/assets/cloud_lightning_heavyrain.svg')
  dataStructure.set(221, '../src/assets/cloud_lightning_heavyrain.svg')
  dataStructure.set(232, '../src/assets/cloud_lightning_heavyrain.svg')
  dataStructure.set(200, '../src/assets/cloud_lightning_heavyrain.svg')
  dataStructure.set(210, '../src/assets/cloud_lightning_heavyrain.svg')
  dataStructure.set(230, '../src/assets/cloud_lightning_heavyrain.svg')
  dataStructure.set(231, '../src/assets/cloud_lightning_heavyrain.svg')
  dataStructure.set(300, '../src/assets/3_waterdrop.svg')
  dataStructure.set(301, '../src/assets/3_waterdrop.svg')
  dataStructure.set(302, '../src/assets/3_waterdrop.svg')
  dataStructure.set(310, '../src/assets/3_waterdrop.svg')
  dataStructure.set(311, '../src/assets/3_waterdrop.svg')
  dataStructure.set(312, '../src/assets/3_waterdrop.svg')
  dataStructure.set(313, '../src/assets/3_waterdrop.svg')
  dataStructure.set(314, '../src/assets/3_waterdrop.svg')
  dataStructure.set(321, '../src/assets/3_waterdrop.svg')
  dataStructure.set(500, '../src/assets/cloud_sing_waterdrop.svg')
  dataStructure.set(501, '../src/assets/cloud_sing_waterdrop.svg')
  dataStructure.set(520, '../src/assets/cloud_sing_waterdrop.svg')
  dataStructure.set(521, '../src/assets/cloud_sing_waterdrop.svg')
  dataStructure.set(502, '../src/assets/cloud_heavyrain.svg')
  dataStructure.set(503, '../src/assets/cloud_heavyrain.svg')
  dataStructure.set(504, '../src/assets/cloud_heavyrain.svg')
  dataStructure.set(511, '../src/assets/cloud_heavyrain.svg')
  dataStructure.set(522, '../src/assets/cloud_heavyrain.svg')
  dataStructure.set(531, '../src/assets/cloud_heavyrain.svg')
  dataStructure.set(600, '../src/assets/cloud_sing_snowflake.svg')
  dataStructure.set(601, '../src/assets/cloud_sing_snowflake.svg')
  dataStructure.set(612, '../src/assets/cloud_sing_snowflake.svg')
  dataStructure.set(615, '../src/assets/cloud_sing_snowflake.svg')
  dataStructure.set(616, '../src/assets/cloud_sing_snowflake.svg')
  dataStructure.set(620, '../src/assets/cloud_sing_snowflake.svg')
  dataStructure.set(602, '../src/assets/cloud_3_snowflake.svg')
  dataStructure.set(611, '../src/assets/cloud_3_snowflake.svg')
  dataStructure.set(613, '../src/assets/cloud_3_snowflake.svg')
  dataStructure.set(621, '../src/assets/cloud_3_snowflake.svg')
  dataStructure.set(622, '../src/assets/cloud_3_snowflake.svg')
  dataStructure.set(701, '../src/assets/waves.svg')
  dataStructure.set(711, '../src/assets/waves.svg')
  dataStructure.set(721, '../src/assets/waves.svg')
  dataStructure.set(731, '../src/assets/waves.svg')
  dataStructure.set(741, '../src/assets/waves.svg')
  dataStructure.set(751, '../src/assets/waves.svg')
  dataStructure.set(761, '../src/assets/waves.svg')
  dataStructure.set(762, '../src/assets/waves.svg')
  dataStructure.set(771, '../src/assets/waves.svg')
  dataStructure.set(781, '../src/assets/tornado.svg')
  dataStructure.set(800, '../src/assets/full_sun.svg')
  dataStructure.set(804, '../src/assets/cloud.svg')
  dataStructure.set(801, '../src/assets/cloud_sun.svg')
  dataStructure.set(802, '../src/assets/cloud_sun.svg')
  dataStructure.set(803, '../src/assets/cloud_sun.svg')

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
            precipitation: dataStructure.get(
              response.data.list[i].weather[0].id
            ),
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

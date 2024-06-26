import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Clothing, { Today } from '@/components/SuggestionFront'

const Activity: React.FC = () => {
  const [forecast, setForecast] = useState<Today | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const dataStructure = new Map()
  dataStructure.set(201, '../src/assets/cloud_lightning_heavyrain.svg')
  //... Add all other mappings here

  const tempRanges = new Map([
    [[-40, 30], 'It is WAY too cold out! Dress in layers and stay warm.'],
    [[31, 40], 'Brrr... keep that winter coat zipped up today!'],
    [[41, 50], 'Bring out the puffers and sip on some hot coco!'],
    [[51, 60], 'Today is perfect sweater weather!'],
    [
      [61, 70],
      'A nice, cool day! Dress in light layers in case you get chilly.',
    ],
    [
      [71, 80],
      'Get outside if you can! Perfect weather for shorts and a tank top. ',
    ],
    [[81, 90], 'It is hot out here! Great time to bring out the short-shorts.'],
    [
      [91, 120],
      'It is way too hot! Dress light and stay cool with an icey beverage.',
    ],
  ])

  const weatherConditions = new Map([
    ['Rain', ' Also, grab an umbrella and prepare for puddles!'],
    ['Clouds', ' It is cloudy, so ditch those sunnies!'],
    ['Snow', ' Time to build a snowman or stay warm by a fire!'],
    ['Thunderstorm', ' Stay safe from the thunderstorm!'],
    ['Clear', ' Clear skies await!'],
    ['Drizzle', ' Also, grab a raincoat if you’ll be outside!'],
    ['Tornado', ' Find safety and stay there!'],
    ['Dust', ' Be weary of the dust!'],
    ['Mist', ' Prepare for some mist!'],
    ['Smoke', ' Be weary of the smoke!'],
    ['Fog', ' Be careful driving in the fog!'],
    ['Sand', ' Find safety and stay there!'],
    ['Haze', ' Find safety and stay there!'],
    ['Ash', ' Find safety and stay there!'],
    ['Squall', ' Find safety and stay there!'],
  ])

  const clothingIcons = new Map([
    [[-40, 30], '../src/assets/socold.svg'],
    [[31, 40], '../src/assets/wintercoat.svg'],
    [[41, 50], '../src/assets/puffer.svg'],
    [[51, 60], '../src/assets/sweater.svg'],
    [[61, 70], '../src/assets/lightlayer.svg'],
    [[71, 80], '../src/assets/tankandshorts.svg'],
    [[81, 90], '../src/assets/shortshorts.svg'],
    [[91, 120], '../src/assets/icedbev.svg'],
  ])

  const getTempRange = (feelsLike: number): string => {
    for (const [[start, end], value] of tempRanges) {
      if (feelsLike >= start && feelsLike <= end) {
        return value
      }
    }
    return 'Temperature out of range'
  }

  const getPic = (feelsLike: number): string => {
    for (const [[start, end], value] of clothingIcons) {
      if (feelsLike >= start && feelsLike <= end) {
        return value
      }
    }
    return 'Temperature out of range'
  }

  const getWeatherCondition = (condition: string): string => {
    return weatherConditions.get(condition) || weatherConditions.get('ELSE')!
  }

  useEffect(() => {
    const fetchWeatherData = async (latitude: number, longitude: number) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=1&units=imperial&appid=925cea5983a4d4da4ea3ffa502d82252`
        )

        const feelsLike = Math.floor(response.data.list[0].feels_like.day)
        const weatherCondition = response.data.list[0].weather[0].main

        const transformedData: Today = {
          feelslike: feelsLike,
          precipitation: getTempRange(feelsLike),
          weatherid: getWeatherCondition(weatherCondition),
          pics: getPic(feelsLike),
        }

        setForecast(transformedData)
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

  return forecast && <Clothing {...forecast} />
}

export default Activity

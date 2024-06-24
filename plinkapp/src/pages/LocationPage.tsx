import Navbar from '@/components/Navbar.tsx'
//import LocationPage from '@/pages/LocationPage'
import SearchPage from '@/pages/SearchPage'
import MapPage from '@/pages/MapPage'
//import ErrorPage from './pages/ErrorPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import React, { useState, useEffect, useContext } from 'react'

import FeatureWeatherCard from '@/components/FeatureWeatherCard'
import LocationCard from '@/components/LocationCard'
import Banner from '@/components/Banner'
//import './index.css'
import MapCard from '@/components/card/MapCard'

const dataStructure = new Map()
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

const apiKey = '8679a3e4f001bb9961c1810bb6e10426'

let imgSrc = ''

interface LocationProps {
  currentLoc: boolean
  location?: string
}

const LocationPage = (props: LocationProps) => {
  const [showBanner, setShowBanner] = useState(false)
  const [bannerProps, setBannerProps] = useState({
    message: '',
    type: '',
    onClose: () => {},
  })
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [temp, setTemp] = useState<number | null>(null)
  const [wind, setWind] = useState<number | null>(null)
  const [cityName, setCityName] = useState('')
  const [humidity, setHumidity] = useState(null)
  const [feels_like, setFeelsLike] = useState<number | null>(null)
  const [vis, setRain] = useState<number | null>(0)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLatitude(latitude)
          setLongitude(longitude)
        },
        (error) => {
          console.error('Error getting geolocation: ', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  const API_url =
    'https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}'
  const showError = () => {
    setBannerProps({
      message: 'Severe Weather in your Area',
      type: 'error',
      onClose: () => setShowBanner(false),
    })
    setShowBanner(true)
  }

  const mapWeath = (number: any) => {
    let id = dataStructure.get(number)
    console.log(number)
    console.log(id)
    imgSrc = id
  }
  useEffect(() => {
    if (latitude && longitude) {
      const API_url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`

      fetch(API_url)
        .then((response) => response.json())
        .then((data) => {
          mapWeath(data.weather[0].id)
          setTemp(Math.floor(data.main.temp))
          setCityName(data.name)
          setHumidity(data.main.humidity)
          setFeelsLike(Math.floor(data.main.feels_like))
          setWind(Math.floor(data.wind.speed))
          setRain(data.rain?.['1h'] ?? 0) // Adjust based on the API response for rain
        })
        .catch((error) => console.error('Error:', error))
    }
  }, [latitude, longitude])

  return (
    <>
      {showBanner && <Banner {...bannerProps} />}

      <div className="mx-auto flex min-h-screen flex-col items-center justify-center bg-bgwhite">
        {/* Content For Page */}
        <button onClick={showError}>Show Error</button>

        <div
          className="flex h-screen w-96 items-center justify-center bg-cardgray shadow-xl"
          style={{
            position: 'relative',
            width: '393px',
            height: '1793px',
          }}
        >
          <LocationCard city={cityName} img_src={imgSrc} temp={temp || 0} />

          <FeatureWeatherCard
            img_src="../src/assets/waves.svg"
            condition="Humidity"
            value={`${humidity}%`}
            left="20px"
            top="1000px"
            color="bg-tempblue"
          ></FeatureWeatherCard>

          <FeatureWeatherCard
            img_src="../src/assets/wind.svg"
            condition="Wind Speed"
            value={`${wind} mph`}
            left="200px"
            top=""
            color="bg-tempceladon"
          ></FeatureWeatherCard>
          <FeatureWeatherCard
            img_src="../src/assets/sing_waterdrop.svg"
            condition="Rain"
            value={`${vis} mm`}
            left="200px"
            top="1000px"
            color="bg-tempperi"
          ></FeatureWeatherCard>
          <FeatureWeatherCard
            img_src="../src/assets/thermometer.svg"
            condition="Feels Like"
            value={`${feels_like}°F`}
            left="20px"
            top="2000"
            color="bg-tempplum"
          ></FeatureWeatherCard>
          <MapCard></MapCard>
        </div>

        {props.currentLoc ? (
          <Navbar selected="currentLoc" />
        ) : (
          <Navbar selected="search" />
          // Insert search page formatting here
        )}
      </div>
    </>
  )
}

export default LocationPage

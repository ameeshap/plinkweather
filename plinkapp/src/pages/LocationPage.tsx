import Navbar from '@/components/Navbar.tsx'
//import LocationPage from '@/pages/LocationPage'
import SearchPage from '@/pages/SearchPage'
import MapPage from '@/pages/MapPage'
//import ErrorPage from './pages/ErrorPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import FeatureWeatherCard from '@/components/FeatureWeatherCard'
import LocationCard from '@/components/LocationCard'
import Banner from '@/components/Banner'
//import './index.css'
import MapCard from '@/components/card/MapCard'

const apiKey = '8679a3e4f001bb9961c1810bb6e10426'

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
  const [latitude, setLatitude] = useState<number | null>(null);
const [longitude, setLongitude] = useState<number | null>(null);
  const [temp, setTemp] = useState<number | null>(null);
  const [wind, setWind] = useState<number | null>(null);
  const [cityName, setCityName] = useState('')
  const [humidity, setHumidity] = useState(null)
  const [feels_like, setFeelsLike] = useState<number | null>(null);
  const [vis, setVisibility] = useState<number | null>(null);

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
      message: 'An error occurred.',
      type: 'error',
      onClose: () => setShowBanner(false),
    })
    setShowBanner(true)
  }
  useEffect(() => {
    if (latitude && longitude) {
      const API_url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`

      fetch(API_url)
        .then((response) => response.json())
        .then((data) => {
          setTemp(Math.floor(data.main.temp))
          setCityName(data.name)
          setHumidity(data.main.humidity)
          setFeelsLike(Math.floor(data.main.feels_like))
          setWind(Math.floor(data.wind.speed))
          setVisibility(data.visibility) // Adjust based on the API response for rain
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
          <LocationCard
            city={cityName}
            img_src="../src/assets/full_sun.svg"
            temp={temp||0}
          />

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
            condition="Visibility"
            value={`${vis}`}
            left="200px"
            top="1000px"
            color="bg-tempperi"
          ></FeatureWeatherCard>
          <FeatureWeatherCard
            img_src="../src/assets/fahrenheit.svg"
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

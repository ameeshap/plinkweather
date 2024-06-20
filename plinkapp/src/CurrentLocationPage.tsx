import LocationPage from '@/pages/LocationPage'
import SearchPage from '@/pages/SearchPage'
import MapPage from '@/pages/MapPage'
import ErrorPage from './pages/ErrorPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import FeatureWeatherCard from './components/FeatureWeatherCard'
import LocationCard from './components/LocationCard'
import './index.css'
import MapCard from './components/card/MapCard'
import Navbar from './components/Navbar'

export default CurrentLocationPage

function CurrentLocationPage() {
  return (
    <>
      <main className="min-w-screen flex min-h-screen flex-col items-center justify-between bg-bgwhite">
        <div
          className="flex h-screen w-96 items-center justify-center bg-cardgray shadow-xl"
          style={{
            position: 'relative',
            width: '393px',
            height: '1793px',
          }}
        >
          <LocationCard
            city="Chicago"
            img_src="../src/assets/full_sun.svg"
            temp={78}
          />

          <FeatureWeatherCard
            img_src="../src/assets/waves.svg"
            condition="Humidity"
            value="30%"
            left="20px"
            top="1000px"
            color="bg-tempblue"
          ></FeatureWeatherCard>

          <FeatureWeatherCard
            img_src="../src/assets/wind.svg"
            condition="Wind Speed"
            value="30%"
            left="200px"
            top=""
            color="bg-tempceladon"
          ></FeatureWeatherCard>
          <FeatureWeatherCard
            img_src="../src/assets/sing_waterdrop.svg"
            condition="Chance of Rain"
            value="40%"
            left="200px"
            top="1000px"
            color="bg-tempperi"
          ></FeatureWeatherCard>
          <FeatureWeatherCard
            img_src="../src/assets/fahrenheit.svg"
            condition="Feels Like"
            value="82"
            left="20px"
            top="2000"
            color="bg-tempplum"
          ></FeatureWeatherCard>
          <MapCard></MapCard>
        </div>
      </main>
    </>
  )
}

import Navbar from '@/components/Navbar.tsx'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import FeatureWeatherCard from '@/components/FeatureWeatherCard'
import LocationCard from '@/components/LocationCard'
import Banner from '@/components/Banner'
import MapCard from '@/components/card/MapCard'

// ? Type and data from localStorage store
import { locationData, fetchLocationData } from '@/components/store'
import useLocationStore from '@/components/store'
import HourlyForecast from '@/components/HourlyForecast'
import WeeklyWeather from '@/components/WeeklyForecast'
import weatherIcons from '@/components/weatherIcons'

import Activity from '@/components/SuggestionBack'
import Clothing from '@/components/SuggestionFront'

interface LocationProps {
  currentLoc: boolean
}

const LocationPage = (props: LocationProps) => {
  // Controlling weather alerts
  const [showBanner, setShowBanner] = useState(false)
  const [bannerProps, setBannerProps] = useState({
    message: '',
    type: '',
    onClose: () => {},
  })
  const fetchCurrentLoc = useLocationStore(
    (state) => state.fetchCurrentLocation
  )

  const [selectedLocation, setSelectedLocation] = useState<locationData>()

  // Import city's name from the URL
  const { cityName } = useParams<{ cityName: string }>()
  const city = cityName ? cityName.replace(/-/g, ' ').replace(/:/g, '') : ''

  // ? Variable to check if API calls are done
  const [isLoading, setIsLoading] = useState(true)
  // ? Pulls location data from different city if currentLoc is false

  useEffect(() => {
    const fetchLocation = async () => {
      if (props.currentLoc) {
        console.log('currentLoc')
        const value = await fetchCurrentLoc()
        setSelectedLocation(value)
        setIsLoading(false)
        console.log(value)
      } else if (city && !props.currentLoc) {
        console.log('customLoc')
        const value = await fetchLocationData(city)
        setSelectedLocation(value)
        setIsLoading(false)
        console.log(value)
      }
    }
    fetchLocation()
  }, [fetchLocationData])
  const getIconPath = (weatherCode: any) => {
    return weatherIcons.get(weatherCode) || '../src/assets/default_icon.svg'
  }

  return (
    <>
      {showBanner && <Banner {...bannerProps} />}
      <div className="mx-auto flex min-h-screen flex-col items-center justify-center bg-bgwhite">
        {/* Content For Page */}
        {/* <button onClick={showError}>Show Error</button> */}

        <div
          className="flex min-h-screen min-w-96 flex-col items-center justify-center bg-bgwhite shadow-xl"
          style={{
            position: 'relative',
            width: '393px',
            height: '1793px',
          }}
        >
          {!isLoading && selectedLocation ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <LocationCard
                city={selectedLocation.city}
                img_src={getIconPath(selectedLocation.currWeath)}
                temp={selectedLocation.temp || 0}
              />
              {/* Hourly Weather Carousel */}
              <HourlyForecast
                lat={selectedLocation.lat}
                long={selectedLocation.long}
              />

             <Activity></Activity>

              {/* Weekly Weather Carousel */}
              <WeeklyWeather
                lat={selectedLocation.lat}
                long={selectedLocation.long}
              />
              <FeatureWeatherCard
                img_src="../src/assets/waves.svg"
                condition="Humidity"
                value={`${selectedLocation.humidity}%`}
                left="20px"
                top="1150px"
                color="bg-tempblue"
              ></FeatureWeatherCard>
              <FeatureWeatherCard
                img_src="../src/assets/wind.svg"
                condition="Wind Speed"
                value={`${selectedLocation.wind} mph`}
                left="200px"
                top="1150px"
                color="bg-tempceladon"
              ></FeatureWeatherCard>
              <FeatureWeatherCard
                img_src="../src/assets/sing_waterdrop.svg"
                condition="Visibility"
                value={`${selectedLocation.visibility / 1000} km`}
                left="200px"
                top="980px"
                color="bg-tempperi"
              ></FeatureWeatherCard>
              <FeatureWeatherCard
                img_src="../src/assets/thermometer.svg"
                condition="Feels Like"
                value={`${selectedLocation.feels_like}°F`}
                left="20px"
                top="980px"
                color="bg-tempplum"
              ></FeatureWeatherCard>
              <MapCard
                height="341px"
                width="347px"
                borderR="20px"
                top="350px"
                z="0"
              ></MapCard>
            </div>
          ) : (
            <p>Loading</p>
          )}
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

import Navbar from '@/components/Navbar.tsx'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import FeatureWeatherCard from '@/components/FeatureWeatherCard'
import LocationCard from '@/components/LocationCard'
// import Banner from '@/components/Banner'
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
  // const [showBanner, setShowBanner] = useState(false)
  // const [bannerProps, setBannerProps] = useState({
  //   message: '',
  //   type: '',
  //   onClose: () => {},
  // })
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
      {/* {showBanner && <Banner {...bannerProps} />} */}
      <div className="flex min-h-screen w-screen flex-col items-center justify-center overflow-x-hidden bg-bgwhite">
        {/* Content For Page */}
        {/* App Name/Title */}
        <div className="ml-6 mt-4 flex h-auto w-screen flex-row gap-3 pb-4">
          <img src="/assets/sing_waterdrop.svg" className="my-auto h-8 w-8" />
          <h1 className="my-auto h-auto w-screen text-left font-inter text-[2rem] font-semibold italic">
            Plink!
          </h1>
        </div>

        {!isLoading && selectedLocation ? (
          <div className="flex h-full w-screen flex-col items-center">
            <div className="h-auto w-80 pb-10">
              <LocationCard
                city={selectedLocation.city}
                img_src={getIconPath(selectedLocation.currWeath)}
                temp={selectedLocation.temp || 0}
              />
            </div>
            {/* Hourly Weather Carousel */}
            <HourlyForecast
              lat={selectedLocation.lat}
              long={selectedLocation.long}
            />

            <Activity></Activity>

            {/* Weekly Weather Carousel */}
            <div className="pb-10">
              <WeeklyWeather
                lat={selectedLocation.lat}
                long={selectedLocation.long}
              />
            </div>
            <div className="mx-auto flex h-auto w-full flex-row flex-wrap justify-center gap-6">
              <FeatureWeatherCard
                img_src="/assets/waves.svg"
                condition="Humidity"
                value={`${selectedLocation.humidity}%`}
                color="bg-tempblue"
              />
              <FeatureWeatherCard
                img_src="/assets/wind.svg"
                condition="Wind Speed"
                value={`${selectedLocation.wind} mph`}
                color="bg-tempceladon"
              />
              <FeatureWeatherCard
                img_src="/assets/sing_waterdrop.svg"
                condition="Visibility"
                value={`${selectedLocation.visibility / 1000} km`}
                color="bg-tempperi"
              />
              <FeatureWeatherCard
                img_src="/assets/thermometer.svg"
                condition="Feels Like"
                value={`${selectedLocation.feels_like}°F`}
                color="bg-tempplum"
              />
            </div>
            <MapCard
              height="341px"
              width="347px"
              borderR="20px"
              top="350px"
              z="0"
            />
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
      {/* </div> */}
    </>
  )
}

export default LocationPage

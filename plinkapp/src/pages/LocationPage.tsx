import Navbar from '@/components/Navbar.tsx'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import FeatureWeatherCard from '@/components/FeatureWeatherCard'
import LocationCard from '@/components/LocationCard'
import MapCard from '@/components/card/MapCard'

// ? Type and data from localStorage store
import { locationData, fetchLocationData } from '@/components/store'
import useLocationStore from '@/components/store'
import HourlyForecast from '@/components/HourlyForecast'
import WeeklyWeather from '@/components/WeeklyForecast'
import weatherIcons from '@/components/weatherIcons'
import { fetchExtremeWeatherAlerts, useSettingsStore } from '@/components/store'

import Activity from '@/components/SuggestionBack'

interface LocationProps {
  currentLoc: boolean
}

function alertToast(msg: any) {
  toast(msg.name + '\n\n' + msg.description.replace(/(\r\n|\n|\r)/gm, ''), {
    duration: 10000,
    position: 'top-center',
  })
}

const LocationPage = (props: LocationProps) => {
  const fetchCurrentLoc = useLocationStore(
    (state) => state.fetchCurrentLocation
  )

  const [selectedLocation, setSelectedLocation] = useState<locationData>()
  const severeWeather = useSettingsStore((state) => state.severeWeather)

  // Import city's name from the URL
  const { cityName } = useParams<{ cityName: string }>()
  const city = cityName ? cityName.replace(/-/g, ' ').replace(/:/g, '') : ''

  // ? Variable to check if API calls are done
  const [isLoading, setIsLoading] = useState(true)

  // ? Pulls location data from different city if currentLoc is false
  useEffect(() => {
    const fetchLocation = async () => {
      if (props.currentLoc) {
        const value = await fetchCurrentLoc()
        setSelectedLocation(value)
        setIsLoading(false)
      } else if (city && !props.currentLoc) {
        const value = await fetchLocationData(city)
        setSelectedLocation(value)
        setIsLoading(false)
      }
    }
    fetchLocation()
  }, [fetchLocationData])

  const getIconPath = (weatherCode: any) => {
    return weatherIcons.get(weatherCode) || '/assets/default_icon.svg'
  }

  // ? Fetches weather alerts for the current location
  useEffect(() => {
    const fetchAlerts = async () => {
      if (severeWeather == true && selectedLocation && !isLoading) {
        const value = await fetchExtremeWeatherAlerts(
          selectedLocation?.lat,
          selectedLocation?.long
        )
        alertToast(value)
      }
    }
    fetchAlerts()
  }, [isLoading])

  return (
    <>
      {/* {showBanner && <Banner {...bannerProps} />} */}
      <div className="flex min-h-screen w-screen flex-col items-center justify-center overflow-x-hidden bg-bgwhite pb-20">
        {/* Content For Page */}
        {!isLoading && selectedLocation ? (
          <>
            {/* App Name/Title */}
            <div className="ml-6 mt-4 flex h-auto w-screen flex-row gap-3 pb-4">
              <img
                src="/assets/sing_waterdrop.svg"
                className="my-auto h-8 w-8"
              />
              <h1 className="my-auto h-auto w-screen text-left font-inter text-[2rem] font-semibold italic">
                Plink!
              </h1>
            </div>
            <div className="flex h-full w-screen flex-col items-center">
              <div className="h-auto w-80 pb-4">
                {' '}
                {/* Adjust the padding bottom here */}
                <LocationCard
                  city={selectedLocation.city}
                  img_src={getIconPath(selectedLocation.currWeath)}
                  temp={selectedLocation.temp || 0}
                />
              </div>
              {/* Hourly Weather Carousel */}
              <div className="mb-2">
                {' '}
                {/* You can adjust the margin bottom here */}
                <HourlyForecast
                  lat={selectedLocation.lat}
                  long={selectedLocation.long}
                />
              </div>
              <div className="mb-4">
                <Activity />
                {/* Weekly Weather Carousel */}

                <WeeklyWeather
                  lat={selectedLocation.lat}
                  long={selectedLocation.long}
                />
                <div className="grid grid-cols-2 gap-4 p-5">
                  <FeatureWeatherCard
                    img_src="../public/assets/waves.svg"
                    condition="Humidity"
                    value={`${selectedLocation.humidity}%`}
                    color="bg-tempceladon"
                  />
                  <FeatureWeatherCard
                    img_src="../public/assets/wind.svg"
                    condition="Wind Speed"
                    value={`${selectedLocation.wind} mph`}
                    color="bg-tempblue"
                  />
                  <FeatureWeatherCard
                    img_src="../public/assets/sing_waterdrop.svg"
                    condition="Visibility"
                    value={`${selectedLocation.visibility / 1000} km`}
                    color="bg-tempperi"
                  />
                  <FeatureWeatherCard
                    img_src="../public/assets/sunset.svg"
                    condition="Sunset"
                    value={`${selectedLocation.feels_like}`}
                    color="bg-tempplum"
                  />
                </div>
              </div>
              <div className="mb-4">
                <MapCard
                  height="341px"
                  width="385px"
                  borderR="20px"
                  top="0px"
                  z="0"
                />
              </div>
            </div>
          </>
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

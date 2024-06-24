import Navbar from '@/components/Navbar.tsx'
import { useState, useEffect } from 'react'

import FeatureWeatherCard from '@/components/FeatureWeatherCard'
import LocationCard from '@/components/LocationCard'
import Banner from '@/components/Banner'
import MapCard from '@/components/card/MapCard'

// Type and data from localStorage store
import { locationData } from '@/components/store'
import useLocationStore from '@/components/store'

interface LocationProps {
  currentLoc: boolean
  location?: locationData
}

const LocationPage = (props: LocationProps) => {
  // Controlling weather alerts
  const [showBanner, setShowBanner] = useState(false)
  const [bannerProps, setBannerProps] = useState({
    message: '',
    type: '',
    onClose: () => {},
  })
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const locations = useLocationStore((state) => state.locations)
  const addLocation = useLocationStore((state) => state.addLocation)
  const fetchCurrentLoc = useLocationStore(
    (state) => state.fetchCurrentLocation
  )
  const currentLocation = useLocationStore((state) => state.currentLoc)

  const showError = () => {
    setBannerProps({
      message: 'An error occurred.',
      type: 'error',
      onClose: () => setShowBanner(false),
    })
    setShowBanner(true)
  }

  useEffect(() => {
    const fetchLocationData = async () => {
      await fetchCurrentLoc()
      setIsLoading(false)
    }
    fetchLocationData()
  }, [fetchCurrentLoc])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!currentLocation) {
    return <div>Error: Could not fetch current location</div>
  }

  // const currentLocation = locations[0]

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
            city={currentLocation.city}
            img_src="../src/assets/full_sun.svg"
            temp={currentLocation.temp || 0}
          />

          <FeatureWeatherCard
            img_src="../src/assets/waves.svg"
            condition="Humidity"
            value={`${currentLocation.humidity}%`}
            left="20px"
            top="1000px"
            color="bg-tempblue"
          ></FeatureWeatherCard>

          <FeatureWeatherCard
            img_src="../src/assets/wind.svg"
            condition="Wind Speed"
            value={`${currentLocation.wind} mph`}
            left="200px"
            top=""
            color="bg-tempceladon"
          ></FeatureWeatherCard>
          <FeatureWeatherCard
            img_src="../src/assets/sing_waterdrop.svg"
            condition="Visibility"
            value={`${currentLocation.visibility}`}
            left="200px"
            top="1000px"
            color="bg-tempperi"
          ></FeatureWeatherCard>
          <FeatureWeatherCard
            img_src="../src/assets/fahrenheit.svg"
            condition="Feels Like"
            value={`${currentLocation.feels_like}°F`}
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

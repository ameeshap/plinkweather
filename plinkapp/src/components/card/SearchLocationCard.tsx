import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'
import { lookupViaCity } from 'city-timezones'
import useLocationStore, { fetchLocationData, locationData } from '../store'


interface SearchLocationCardProps {
  // Variables for location
  currentLoc: boolean
  city?: string
}

const SearchLocationCard: React.FC<SearchLocationCardProps> = (props) => {
  const fetchCurrentLoc = useLocationStore(
    (state) => state.fetchCurrentLocation
  )
  const locations = useLocationStore((state) => state.locations)
  const [selectedLoc, setSelectedLoc] = useState<locationData | null>(
    locations[0] ? locations[0] : null
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [localTemp, setLocalTemp] = useState<number | null>()
  const [localTimeZone, setLocalTimeZone] = useState<string>()
  const [localTime, setLocalTime] = useState<DateTime>(
    DateTime.local().setZone(localTimeZone)
  )

  useEffect(() => {
    const fetchTemperature = async () => {
      if (props.currentLoc && !selectedLoc) {
        const value = await fetchCurrentLoc()
        setSelectedLoc(value)
        setIsLoading(false)
      } else if (props.city && !props.currentLoc) {
        const value = await fetchLocationData(props.city)
        setSelectedLoc(value)
        setIsLoading(false)
      }
    }
    fetchTemperature()
  }, [props.currentLoc])

  useEffect(() => {
    const setTime = async () => {
      if (selectedLoc && !isLoading) {
        setLocalTemp(selectedLoc.temp)
        setLocalTimeZone(lookupViaCity(selectedLoc.city)[0]?.timezone)
        setLocalTime(DateTime.local().setZone(localTimeZone))
      }
    }
    setTime()
  }, [selectedLoc])

  // Functionality for color change with tempuerature
  function tempColorPicker(n: number) {
    if (n < 32) return 'bg-tempblue'
    if (n > 32 && n < 85) return 'bg-tempgreen'
    if (n > 85) return 'bg-tempred'
    return 'bg-tempblue'
  }

  return (
    <>
      {!isLoading && selectedLoc ? (
        <Link
          to={`/search/:${selectedLoc.city.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <div
            className={
              'mx-2 mt-4 flex h-24 w-auto flex-grow flex-row justify-between rounded-2xl pl-4' +
              ' ' +
              (localTemp !== null ? tempColorPicker(selectedLoc.temp) : '')
            }
          >
            <div className="flex flex-col">
              <p className="flex pt-2 text-3xl font-semibold italic">
                {selectedLoc.city}
              </p>
              <p className="">{localTime.toFormat('h:mm a')}</p>
              {props.currentLoc ? <p>Current Location</p> : null}
            </div>
            <p className="flex self-center pr-5 text-[3rem] font-semibold">
              {selectedLoc.temp !== null ? (
                `${selectedLoc.temp}°`
              ) : (
                <p className="loading loading-dots loading-lg mr-10"></p>
              )}
            </p>
          </div>
        </Link>
      ) : (
        <></>
      )}
    </>
  )
}

export default SearchLocationCard

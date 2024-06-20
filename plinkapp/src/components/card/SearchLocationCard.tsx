import { DateTime } from 'luxon'
import { useState } from 'react'
import { CityData, findFromCityStateProvince } from 'city-timezones'

interface SearchLocationCardProps {
  // Variables for location
  city: string
  state: string
}

const SearchLocationCard = (props: SearchLocationCardProps) => {
  const localTimeZone = findFromCityStateProvince(
    props.city + ' ' + props.state
  )[0].timezone
  const localTime = DateTime.local().setZone(localTimeZone)
  // PUT IN FETCH HERE
  const localTemp = 32

  function tempColorPicker(n: number) {
    if (n < 32) return 'bg-tempblue'

    if (n > 32 && n < 85) return 'bg-tempgreen'

    if (n > 85) return 'bg-tempred'
    return 'bg-tempblue'
  }

  return (
    <div
      className={
        'mx-2 mt-4 flex h-24 w-auto flex-grow flex-row justify-between rounded-2xl pl-4' +
        ' ' +
        tempColorPicker(localTemp)
      }
    >
      <div className="flex flex-col">
        <p className="pt-2 text-3xl font-semibold italic">{props.city}</p>
        <p className="">{localTime.toFormat('hh:mm a')}</p>
      </div>

      <p className="pr-5 text-[3rem] font-semibold">{localTemp}&deg;</p>
    </div>
  )
}

export default SearchLocationCard

import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'
import { findFromCityStateProvince } from 'city-timezones'

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

  // Functionality for color change with tempuerature
  function tempColorPicker(n: number) {
    if (n < 32) return 'bg-tempblue'

    if (n > 32 && n < 85) return 'bg-tempgreen'

    if (n > 85) return 'bg-tempred'
    return 'bg-tempblue'
  }

  function locationClickHandler(e: any) {
    console.log('Selected: ', props.city)
  }

  return (
    <div
      className={
        'mx-2 mt-4 flex h-24 w-auto flex-grow flex-row justify-between rounded-2xl pl-4' +
        ' ' +
        tempColorPicker(localTemp)
      }
      onClick={(event) => locationClickHandler(event)}
    >
      <div className="flex flex-col">
        <p className="flex pt-2 text-3xl font-semibold italic">{props.city}</p>
        <p className="">{localTime.toFormat('h:mm a')}</p>
      </div>
      <p className="flex self-center pr-5 text-[3rem] font-semibold">
        {localTemp}&deg;
      </p>
    </div>
  )
}

export default SearchLocationCard

import React from 'react'

export interface Hour {
  time: string
  temp: number
  windspeed: number
  precipitation: string
}

interface HourlyForecastProps {
  hours: Hour[]
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hours }) => {
  //console.log('print hours?')
  // console.log(hours)

  return (
    <div
      className="flex space-x-4 overflow-x-scroll bg-cardgray p-4"
      style={{
        width: '393px',
        left: '20px',
      }}
    >
      {hours.map((hour, key) => (
        <div key={key}>
          <div className="flex h-32 w-24 flex-shrink-0 flex-col items-center justify-center rounded-md bg-tempblue shadow-md">
            <p className="font-inter text-lg">{hour.time}</p>
            <img
              //src="../src/assets/3_waterdrop.svg"
              src={hour.precipitation}
              className="small-svg"
            />
            <p className="text-black-500 font-inter text-sm">{hour.temp}°F</p>
            <p className="text-black-500 font-inter text-sm">
              {hour.windspeed} mph
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HourlyForecast

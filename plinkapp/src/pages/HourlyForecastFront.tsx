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
  return (
    <div className="flex space-x-4 overflow-x-scroll bg-bgwhite p-4">
      {hours.map((hour) => (
        <div>
          <p className="flex h-32 w-24 flex-shrink-0 flex-col items-center justify-center rounded-md bg-tempblue shadow-md">
            <p className="font-inter text-lg">{hour.time}</p>
            <img
              //src="../src/assets/3_waterdrop.svg"
              src={hour.precipitation}
              className="small-svg"
            ></img>
            <p className="text-black-500 font-inter text-sm">{hour.temp}°F</p>
            <div className="text-black-500 flex items-center font-inter text-sm">
              <img
                src="/assets/wind.svg"
                alt="Wind icon"
                className="mr-1 h-4 w-4" // Adjust width and height as needed
              />
              <span>{hour.windspeed} mph</span>
            </div>
            {}
          </p>
        </div>
      ))}
    </div>
  )
}

export default HourlyForecast

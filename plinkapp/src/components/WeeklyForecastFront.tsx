//import { dir } from 'console'
import React from 'react'

export interface WeatherDay {
  day: string
  mintemp: number
  maxtemp: number
  precipitation: string
  rainchance: number
}

interface WeeklyForecastProps {
  forecast: WeatherDay[]
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecast }) => {
  return (
    <div className="rounded-lg bg-bgwhite p-4 shadow-md">
      <div className="overflow-x-auto">
        <div className="flex space-x-4">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="min-w-[150px] rounded-lg bg-tempplum p-2 text-center"
            >
              <p className="font-Inter">{day.day}</p>
              <img
                src={day.precipitation}
                className="medium-svg mx-auto"
                alt="weather icon"
              />
              <p className="font-Inter">Low: {day.mintemp}°F</p>
              <p className="font-Inter">High: {day.maxtemp}°F</p>
              <div className="text-black-500 flex items-center justify-center font-inter text-sm">
                <img
                  src="../src/assets/sing_waterdrop.svg"
                  alt="Wind icon"
                  className="mr-1 h-4 w-4" // Adjust width and height as needed
                />
                <span>{day.rainchance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WeeklyForecast

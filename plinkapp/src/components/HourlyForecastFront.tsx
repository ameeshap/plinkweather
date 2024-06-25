import React from 'react'
//import axios from 'axios'

//const API_URL = 'https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API_key}'
//const API_KEY = '8679a3e4f001bb9961c1810bb6e10426'

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
    <div className="flex space-x-4 overflow-x-scroll bg-cardgray p-4" style={{
      
      width:'393px',
      left: '20px'}}>
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
            <p className="text-black-500 font-inter text-sm">
              {hour.windspeed} mph
            </p>
            {}
          </p>
        </div>
      ))}
    </div>
  )
}

export default HourlyForecast

//import { dir } from 'console'
import { useEffect, useState } from 'react'
import { fetchWeeklyWeatherData, WeatherDay } from './store'

interface WeeklyForecastProps {
  lat: number
  long: number
}

const WeeklyForecast = (props: WeeklyForecastProps) => {
  const [forecast, setForecast] = useState<WeatherDay[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchWeeklyWeatherData(props.lat, props.long).then((data) =>
      setForecast(data)
    )
    setLoading(false)
  }, [props.lat, props.long])

  return (
    <div className="w-screen rounded-lg bg-bgwhite py-4 pl-4">
      {!loading ? (
        <>
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
                      src="/assets/sing_waterdrop.svg"
                      alt="Wind icon"
                      className="mr-1 h-4 w-4" // Adjust width and height as needed
                    />
                    <span>{day.rainchance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-2xl">Loading...</div>
      )}
    </div>
  )
}

export default WeeklyForecast

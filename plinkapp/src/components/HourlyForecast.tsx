import { useEffect, useState } from 'react'
import { Hour, fetchHourlyWeatherData } from './store'

interface HourlyForecastProps {
  lat: number
  long: number
}

const HourlyForecast = (props: HourlyForecastProps) => {
  const [hours, setHours] = useState<Hour[]>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHourlyWeatherData(props.lat, props.long).then((data) => setHours(data))
    setLoading(false)
  }, [props.lat, props.long])

  return (
    <div className="flex w-screen gap-4 overflow-x-scroll bg-bgwhite p-4">
      {!loading && hours ? (
        <>
          {hours.map((hour, key) => (
            <div key={key}>
              <div className="flex h-32 w-24 shrink-0 flex-col items-center justify-center rounded-md bg-tempceladon shadow-md">
                <p className="font-inter font-bold text-lg">{hour.time}</p>
                <img
                  //src="../src/assets/3_waterdrop.svg"
                  src={hour.precipitation}
                  className="small-svg"
                />
                <p className="text-black-500 font-inter text-sm">
                  {hour.temp}&deg;F
                </p>
                <p className="text-black-500 font-inter text-sm">
                  {hour.windspeed} mph
                </p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="text-2xl">Loading...</div>
      )}
    </div>
  )
}

export default HourlyForecast

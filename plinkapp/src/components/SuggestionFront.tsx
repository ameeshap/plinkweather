import React from 'react'

export interface Today {
  feelslike: number
  precipitation: string
  weatherid: string
  pics: string
}

const Clothing: React.FC<Today> = ({
  feelslike,
  precipitation,
  weatherid,
  pics,
}) => {
  return (
    <div className="relative flex min-w-[150px] rounded-lg bg-tempgreen p-4">
      <div className="flex w-full flex-col items-start">
        <div className="absolute left-2 top-2">
          <p className="font-Inter text-medium">Feels Like:</p>
          <p className="font-Inter text-center">{feelslike}°F</p>
        </div>
        <div className="absolute bottom-4 left-4">
          <img src={pics} className="medium-svg" alt="weather icon" />
        </div>
      </div>
      <div className="ml-auto flex flex-col justify-center text-left">
        <p className="font-Inter">
          {precipitation}
          {weatherid}
        </p>
      </div>
    </div>
  )
}

export default Clothing

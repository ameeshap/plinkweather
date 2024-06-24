import React from 'react'

interface WeatherCardProps {
  city: string
  temp: number
  img_src: string
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, temp, img_src }) => {
  return (
    <div
      className="card items-center justify-between bg-tempblue shadow-xl"
      style={{
        position: 'absolute',
        width: '320px',
        height: '292px',
        top: '98px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '20px',
      }}
    >
      <h2 className="card-title font-inter">{city} </h2>
      <figure className="w-133 h-133">
        <img
          src={img_src}
          className="h-full w-full object-cover"
          style={{
            width: '170px',
            height: '170px',
          }}
        ></img>
      </figure>
      <h2 className="card-title font-inter">
        {temp} {'°'}
      </h2>
    </div>
  )
}

export default WeatherCard

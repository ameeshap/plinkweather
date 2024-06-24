import React from 'react'

interface FeatureWeatherCardProps {
  condition: string
  value: String
  img_src: string
  left: string
  top: string
  color: string
}

const FeatureWeatherCard: React.FC<FeatureWeatherCardProps> = ({
  condition,
  value,
  img_src,
  left,
  top,
  color,
}) => {
  return (
    <div
      className={`card items-center justify-center shadow-xl ${color}`}
      style={{
        position: 'absolute',
        width: '168px',
        height: '143px',
        left: left,
        top: top,
        borderRadius: '20px',
      }}
    >
      <h2 className="card-title items-center font-inter">
      <p>{condition}</p>
      </h2>
      <p>{value}</p>

      <figure className="w-133 h-133">
        <img
          src={img_src}
          className="h-full w-full "
          style={{
            width: '35px',
            height: '35px',
          }}
        ></img>
      </figure>
    </div>
  )
}

export default FeatureWeatherCard

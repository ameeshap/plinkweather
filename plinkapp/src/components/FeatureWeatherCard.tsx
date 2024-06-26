interface FeatureWeatherCardProps {
  condition: string
  value: String
  img_src: string
  color: string
}

const FeatureWeatherCard = (props: FeatureWeatherCardProps) => {
  return (
    <div
      className={`flex h-36 w-40 flex-col items-center justify-center rounded-2xl shadow-xl ${props.color}`}
    >
      <h2 className="items-center p-4 font-inter text-xl font-semibold">
        <p>{props.condition}</p>
      </h2>
      <p>{props.value}</p>

      <img src={props.img_src} className="mb-4 h-[35px] w-[35px]" />
    </div>
  )
}

export default FeatureWeatherCard

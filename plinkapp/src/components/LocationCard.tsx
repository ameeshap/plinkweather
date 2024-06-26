interface WeatherCardProps {
  city: string
  temp: number
  img_src: string
}

const WeatherCard = (props: WeatherCardProps) => {
  return (
    <div className="flex h-auto w-auto flex-grow flex-col items-center justify-between rounded-2xl bg-tempblue px-10 shadow-xl">
      <div className="flex flex-col gap-4">
        <h2 className="card-title pt-6 font-inter text-4xl">{props.city}</h2>
        <img
          src={props.img_src}
          className="mx-auto max-h-[5rem] max-w-[5rem]"
        />
        <h2 className="mx-auto pb-6 pl-2 pt-4 font-inter text-3xl font-medium">
          {props.temp}&deg;
        </h2>
      </div>
    </div>
  )
}

export default WeatherCard

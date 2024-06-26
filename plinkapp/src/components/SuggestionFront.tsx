export interface Today {
  feelslike: number
  precipitation: string
  weatherid: string
  pics: string
}

const Clothing = (props: Today) => {
  return (
    <div className="mx-10 flex w-screen bg-tempgreen p-4">
      <div className="flex w-full flex-col items-start">
        <div className="left-2 top-2">
          <p className="font-Inter text-medium">Feels Like:</p>
          <p className="font-Inter text-center">{props.feelslike}°F</p>
        </div>
        <div className="bottom-4 left-4">
          <img src={props.pics} className="medium-svg" alt="weather icon" />
        </div>
      </div>
      <div className="ml-auto flex flex-col justify-center text-left">
        <p className="font-Inter">
          {props.precipitation}
          {props.weatherid}
        </p>
      </div>
    </div>
  )
}

export default Clothing

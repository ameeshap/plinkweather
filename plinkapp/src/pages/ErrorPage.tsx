import Navbar from '@/components/Navbar'

const ErrorPage = () => {
  return (
    <div className="mx-auto flex min-h-screen flex-col place-items-center items-center bg-bgwhite font-inter text-lg font-bold">
      <div className="my-auto flex flex-col">
        <img
          src="../src/assets/cloud_moon_lightning_heavyrain.svg"
          className="mx-auto h-20 w-20"
        />
        <p className="my-auto">Error 404: Page Not Found!</p>
      </div>
      <Navbar />
    </div>
  )
}

export default ErrorPage

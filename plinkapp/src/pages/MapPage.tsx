import Navbar from '@/components/Navbar'
import MapCard from '@/components/card/MapCard'

const MapPage = () => {
  return (
    <div className=" flex min-h-screen g-bgwhite">
      <MapCard
        width="100vw"
        height="100vh"
        borderR="0px"
        top={0}
        z="0"
      ></MapCard>
      <Navbar selected="map" />
    </div>
  )
}

export default MapPage

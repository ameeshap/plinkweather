import Navbar from '@/components/Navbar.tsx'

interface LocationProps {
  currentLoc: boolean
}

const LocationPage = (props: LocationProps) => {
  return (
    <>
      <div className="mx-auto flex min-h-screen flex-col bg-bgwhite">
        {/* Content For Page */}
        <Navbar selected="currentLoc" />
      </div>
    </>
  )
}

export default LocationPage

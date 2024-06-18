import Navbar from '@/components/Navbar.tsx'

interface LocationProps {
  currentLoc: boolean
  location?: string
}

const LocationPage = (props: LocationProps) => {
  return (
    <>
      <div className="mx-auto flex min-h-screen flex-col bg-bgwhite">
        {/* Content For Page */}
        {props.currentLoc ? (
          <Navbar selected="currentLoc" />
        ) : (
          <Navbar selected="search" />
          // Insert search page formatting here
        )}
      </div>
    </>
  )
}

export default LocationPage

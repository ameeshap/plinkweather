import { useEffect, useState } from 'react'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'

import useOnclickOutside from 'react-cool-onclickoutside'
import { Loader } from '@googlemaps/js-api-loader'
import Navbar from '@/components/Navbar'
import SearchLocationCard from '@/components/card/SearchLocationCard'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import useLocationStore from '@/components/store'
import { fetchCityState } from '@/components/store'

const PlacesAutocomplete = ({ onSelect }: any) => {
  const navigate = useNavigate()
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  })

  const ref = useOnclickOutside(() => {
    clearSuggestions()
  })

  const handleInput = (e: any) => {
    setValue(e.target.value)
  }

  const handleSelect =
    ({ description }: any) =>
    () => {
      setValue(description, false)
      clearSuggestions()

      getGeocode({ address: description }).then(async (results) => {
        try {
          const { lat, lng } = getLatLng(results[0])
          onSelect({ lat, lng })
          const { city } = await fetchCityState(lat, lng)
          navigate(`/search/:${city}`)
        } catch (error) {
          console.error('Error:', error)
        }
      })
    }

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion

      return (
        <li
          key={place_id}
          onClick={handleSelect(suggestion)}
          className="cursor-pointer p-2 hover:bg-gray-200"
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      )
    })

  return (
    <div ref={ref} className="relative w-full">
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Search City or Address"
        className="w-full rounded-lg bg-slate-400 p-3 font-semibold placeholder-gray-700"
      />
      {status === 'OK' && (
        <ul className="absolute z-10 w-full rounded-b-lg border border-gray-300 bg-white shadow-lg">
          {renderSuggestions()}
        </ul>
      )}
    </div>
  )
}

const SearchPage = () => {
  const GOOGLEMAPS_API_KEY = process.env.GOOGLEMAPS_API_KEY
  const loader = new Loader({
    apiKey: GOOGLEMAPS_API_KEY as string,
    version: 'weekly',
    libraries: ['places', 'geocoding'],
  })

  const locations = useLocationStore((state) => state.locations)
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false)

  useEffect(() => {
    loader.importLibrary('geocoding').then(() => {
      setIsGoogleMapsLoaded(true)
    })
  }, [loader])

  const handleSelect = (coordinates: any) => {
    // useNavigate
    console.log(coordinates)
  }

  return (
    <div className="mx-auto flex min-h-screen flex-col bg-bgwhite">
      <main>
        {/* Search Bar and Back Arrow*/}
        <section className="mt-4 flex w-full flex-row gap-2">
          {/* Back Button */}
          <div className="ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-400">
            <Link to="..">
              <IoArrowBack color="black" size={35} />
            </Link>
          </div>
          {/* Search Bar */}
          <div className="relative mr-2 flex flex-grow items-center rounded-2xl bg-slate-400 text-black">
            {isGoogleMapsLoaded ? (
              <PlacesAutocomplete onSelect={handleSelect} />
            ) : (
              <p className="ml-3 font-semibold text-gray-700">Loading...</p>
            )}
          </div>
        </section>
        {/* Searched Location Cards */}
        {/* Default Current Location Card */}
        <section className="">
          <SearchLocationCard currentLoc />
          {/* Map for Locations in store */}
          {locations.slice(1).map((location, index) => (
            <SearchLocationCard
              key={index}
              currentLoc={false}
              city={location.city}
            />
          ))}
        </section>
      </main>
      <Navbar selected="search" />
    </div>
  )
}

export default SearchPage

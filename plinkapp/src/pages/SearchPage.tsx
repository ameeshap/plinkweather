import Navbar from '@/components/Navbar'
import SearchLocationCard from '@/components/card/SearchLocationCard'
import { useEffect, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import useOnclickOutside from 'react-cool-onclickoutside'

import { IoArrowBack } from 'react-icons/io5'
import { Link } from 'react-router-dom'

const PlacesAutocomplete = ({ onSelect }: any) => {
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

  const handleInput = (e) => {
    setValue(e.target.value)
  }

  const handleSelect =
    ({ description }: any) =>
    () => {
      setValue(description, false)
      clearSuggestions()

      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0])
        console.log('📍 Coordinates: ', { lat, lng })
        onSelect({ lat, lng })
      })
    }

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      )
    })

  return (
    <div ref={ref}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Search City or Address"
        className="ml-3 flex flex-grow bg-slate-400 font-semibold placeholder-gray-700"
      />
      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  )
}

const SearchPage = () => {
  const GOOGLEMAPS_API_KEY = process.env.GOOGLEMAPS_API_KEY
  const loader = new Loader({
    apiKey: GOOGLEMAPS_API_KEY as string,
    version: 'weekly',
    libraries: ['places'],
  })

  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false)

  useEffect(() => {
    loader.importLibrary('places').then(() => {
      setIsGoogleMapsLoaded(true)
    })
  }, [loader])

  const handleSelect = (coordinates) => {
    console.log('Selected coordinates:', coordinates)
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
          <div className="mr-2 flex h-12 flex-grow items-center rounded-2xl bg-slate-400 text-black">
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
          <SearchLocationCard city={'Houston'} state={'TX'} />
        </section>
      </main>
      <Navbar selected="search" />
    </div>
  )
}

export default SearchPage

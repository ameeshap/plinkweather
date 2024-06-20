import Navbar from '@/components/Navbar'
import SearchLocationCard from '@/components/card/SearchLocationCard'

import { IoArrowBack } from 'react-icons/io5'
import { Link } from 'react-router-dom'
// import { useState, useEffect } from 'react'

const SearchPage = () => {
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
            <p className="ml-3 font-semibold text-gray-700">
              Search City or Address
            </p>
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

import { IoSearch } from 'react-icons/io5'
import { IoListOutline } from 'react-icons/io5'
import { IoLocationOutline } from 'react-icons/io5'
import { IoEarth } from 'react-icons/io5'
import { Link } from 'react-router-dom'

const iconSize = 35

const Navbar = () => {
  return (
    <main className="pb-4 w-screen bg-cardwhite flex flex-grow sticky bottom-0">
      <ul className="flex flex-row sticky w-screen justify-around">
        {/* Link to Current Location */}
        <li className="">
          <IoLocationOutline color="black" size={iconSize}>
            <Link to={'/'} />
          </IoLocationOutline>
        </li>

        {/* Link to list of locations */}
        <li className="">
          <IoSearch color="black" size={iconSize}>
            <Link to={'/'} />
          </IoSearch>
        </li>

        {/* Link to Map of current location */}
        <li className="">
          <IoEarth color="black" size={iconSize}>
            <Link to={'/'} />
          </IoEarth>
        </li>
      </ul>
    </main>
  )
}

export default Navbar

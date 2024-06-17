import { IoSearch } from 'react-icons/io5'
import { IoLocationOutline } from 'react-icons/io5'
import { IoEarth } from 'react-icons/io5'
import { Link } from 'react-router-dom'

const iconSize = 35

const Navbar = () => {
  return (
    <nav className="absolute bottom-0 mx-auto my-auto w-screen">
      <ul className="min-w-screen flex flex-row justify-around bg-tempblue">
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
    </nav>
  )
}

export default Navbar

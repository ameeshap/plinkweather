import { GoDotFill } from 'react-icons/go'
import { IoSearch } from 'react-icons/io5'
import { IoLocationOutline } from 'react-icons/io5'
import { IoEarth } from 'react-icons/io5'
import { Link } from 'react-router-dom'

const iconSize = 35
interface NavBarProps {
  selected?: 'currentLoc' | 'search' | 'map'
}

const Navbar = (props: NavBarProps) => {
  return (
    <nav className="fixed bottom-0 z-10 w-screen border-t-2 border-gray-200 bg-bgwhite py-2">
      <ul className="flex w-screen flex-row justify-around">
        {/* Link to Current Location */}
        <li className="">
          <div className="flex flex-col items-center justify-center self-center">
            <Link to={'/'}>
              <IoLocationOutline color="black" size={iconSize} />
            </Link>
            {/* If selected include a selected indicator */}
            {props.selected === 'currentLoc' ? (
              <GoDotFill color="black" />
            ) : (
              <></>
            )}
          </div>
        </li>

        {/* Link to list of locations */}
        <li className="">
          <div className="flex flex-col items-center justify-center self-center">
            <Link to={'/search'}>
              <IoSearch color="black" size={iconSize} />
            </Link>

            {/* If selected include a selected indicator */}
            {props.selected === 'search' ? <GoDotFill color="black" /> : <></>}
          </div>
        </li>

        {/* Link to Map of current location */}
        <li className="">
          <div className="flex flex-col items-center justify-center self-center">
            <Link to={'/map'}>
              <IoEarth color="black" size={iconSize} />
            </Link>

            {/* If selected include a selected indicator */}
            {props.selected === 'map' ? <GoDotFill color="black" /> : <></>}
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar

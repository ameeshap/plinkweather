import Link from 'next/link'
import { GoHome } from 'react-icons/go'
import { IoMenu } from 'react-icons/io'
import { IoHomeOutline } from 'react-icons/io5'

const Navbar = () => {
  return (
    <main>
      <ul>
        {/* Link to Current Location */}
        <li className="">
          <IoHomeOutline color="black" />
        </li>

        {/* Link to list of locations */}
        <li className=""></li>

        {/* Link to Map of current location */}
        <li className=""></li>
      </ul>
    </main>
  )
}

export default Navbar

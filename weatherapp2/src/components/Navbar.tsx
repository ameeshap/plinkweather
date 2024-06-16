import { GoHome } from 'react-icons/go'
import { IoMenu } from 'react-icons/io'
import { IoHomeOutline } from 'react-icons/io5'

const Navbar = () => {
  return (
    <main className="flex flex-row justify-between w-screen h-24">
      <p className="text-lg text-tempblue">GOOD MORNING GAMERS!!!</p>
      <ul>
        {/* Link to Current Location */}
        <li className="w-10 h-10">
          <IoHomeOutline color="black" size={45} />
        </li>

        {/* Link to list of locations */}
        <li className="">
          <IoHomeOutline color="black" size={45}>
            <link href="/"></link>
          </IoHomeOutline>
        </li>

        {/* Link to Map of current location */}
        <li className="">
          <IoHomeOutline color="black" size={45} />
        </li>
      </ul>
    </main>
  )
}

export default Navbar

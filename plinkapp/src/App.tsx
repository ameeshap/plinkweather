import LocationPage from '@/pages/LocationPage'
import SearchPage from '@/pages/SearchPage'
import MapPage from '@/pages/MapPage'
// import ErrorPage from './pages/ErrorPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import './index.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index element={<LocationPage currentLoc />} />
          <Route path="/" element={<LocationPage currentLoc />} />
          {/* Need to implement dynamic routing for the locations */}
          {/* <Route path="/" element={}/> */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/map" element={<MapPage />} />
          {/* <Route path="*" element={<ErrorPage />} /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App

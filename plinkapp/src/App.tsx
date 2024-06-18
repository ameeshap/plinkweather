import LocationPage from '@/pages/LocationPage'
import SearchPage from '@/pages/SearchPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import './index.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index element={<LocationPage />} />
          <Route path="/" element={<LocationPage />} />
          <Route path="/search" element={<SearchPage />} />
          {/* <Route path="/map" element={<MapPage />} /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App

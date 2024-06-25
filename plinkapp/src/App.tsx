import LocationPage from '@/pages/LocationPage'
import SearchPage from '@/pages/SearchPage'
import MapPage from '@/pages/MapPage'
import ErrorPage from './pages/ErrorPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import HourlyWeather from './components/HourlyForecastBack'

import './index.css'
import SettingsPage from './pages/SettingsPage'

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
          <Route
            path="/search/:cityName"
            element={<LocationPage currentLoc={false} />}
          />
          <Route path="/map" element={<MapPage />} />
          <Route path="/hourly" element={<HourlyWeather />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

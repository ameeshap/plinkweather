import LocationPage from '@/pages/LocationPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import './index.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index element={<LocationPage />} />
          {/* <Route path="/" element={<LocationPage/>} /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App

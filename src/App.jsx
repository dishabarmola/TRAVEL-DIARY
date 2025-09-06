import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Carousel from './components/Carousel'
import Itinerybutton from './components/Itinerybutton'
import About from './components/About'
import Contact from './components/Contact'
import Tripform from './components/Tripform';
import ItineraryPage from './components/ItineraryPage'; 

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div >
              <div className="relative min-h-screen flex items-center justify-center bg-gray-100 h-115">
                <div className="w-full absolute inset-0 z-0 pointer-events-none blur-[0px] opacity-90">
                  <Carousel />
                </div>
                <div className="relative z-10 flex items-center justify-center">
                  <Itinerybutton />
                </div>
              </div>
              <About />
              <div>
                <Contact />
              </div>
            </div>
          }
        />
        <Route path="/tripform" element={<Tripform />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tripform/itinerary" element={<ItineraryPage />} /> 
      </Routes>
    </Router>
  )
}

export default App

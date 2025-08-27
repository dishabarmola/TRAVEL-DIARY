import React from 'react'
import { useNavigate } from 'react-router-dom'

const Itinerybutton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="px-20 py-4 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 text-white rounded-full shadow-md text-xl font-semibold tracking-wide transition-all duration-300 hover:scale-110 hover:from-pink-400 hover:to-rose-400 focus:outline-none focus:ring-4 focus:ring-pink-200"
      onClick={() => navigate('/tripform')}
    >
      🌸 Build my Trip 🌸
    </button>
  )
}

export default Itinerybutton

import React from 'react'

const Contact = () => {
  return (
    <footer id="contact" className="px-20 py-4 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 text-white shadow-md text-xl font-semibold tracking-wide transition-all duration-300 hover:scale-110 hover:from-pink-400 hover:to-rose-400 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left side */}
        <h2 className="text-xl font-bold mb-4 md:mb-0">Get in Touch ✨</h2>
        
        {/* Contact details */}
        <div className="flex space-x-6">
          <a href="mailto:example@email.com" className="font-medium px-3 py-1 rounded transition-all duration-200 hover:bg-pink-400 hover:text-white hover:shadow">
            📧 Email
          </a>
          <a href="tel:" className="font-medium px-3 py-1 rounded transition-all duration-200 hover:bg-pink-400 hover:text-white hover:shadow">
            📞 Call
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="font-medium px-3 py-1 rounded transition-all duration-200 hover:bg-pink-400 hover:text-white hover:shadow">
            🔗 LinkedIn
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="font-medium px-3 py-1 rounded transition-all duration-200 hover:bg-pink-400 hover:text-white hover:shadow">
            💻 GitHub
          </a>
        </div>
      </div>
      
      {/* Bottom small note */}
      <div className="text-center text-sm text-pink-100 mt-4">
        © {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  )
}

export default Contact

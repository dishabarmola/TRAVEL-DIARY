import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png';

const Navbar = () => {
    return (
        <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 text-white shadow-md">
            <div className="logo flex justify-start items-center gap-3">
                <img src={logo} alt="Logo" className="h-10 rounded-full shadow-lg" />
                <h1 className="text-2xl font-bold">Travel Diary</h1>
            </div>
            <div className="nav-links">
                <ul className="flex gap-6 list-none m-0 p-0">
                    <li>
                        <a href="/" className="font-medium px-3 py-1 rounded transition-all duration-200 hover:bg-pink-400 hover:text-white hover:shadow">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#about" className="font-medium px-3 py-1 rounded transition-all duration-200 hover:bg-pink-400 hover:text-white hover:shadow">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="#contact" className="font-medium px-3 py-1 rounded transition-all duration-200 hover:bg-pink-400 hover:text-white hover:shadow">
                            Contact
                        </a>
                    </li>
                    <li>
                        <a href="#profile" className="font-medium px-3 py-1 rounded transition-all duration-200 hover:bg-pink-400 hover:text-white hover:shadow">
                            Profile
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar



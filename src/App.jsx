import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage.jsx'
import SignInUp from './components/SignInUp.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<SignInUp />} />
        <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Contact Us - Coming Soon</h1></div>} />
        <Route path="/about" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">About Us - Coming Soon</h1></div>} />
        <Route path="/pricing" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Pricing - Coming Soon</h1></div>} />
        <Route path="/faq" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">FAQ - Coming Soon</h1></div>} />
        <Route path="/privacy" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Privacy Policy - Coming Soon</h1></div>} />
        <Route path="/terms" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Terms of Service - Coming Soon</h1></div>} />
      </Routes>
    </Router>
  )
}

export default App


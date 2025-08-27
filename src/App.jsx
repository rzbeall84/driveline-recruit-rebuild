import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './components/Homepage.jsx'
import SignInUp from './components/SignInUp.jsx'
import Dashboard from './components/Dashboard.jsx'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already signed in
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const handleAuthSuccess = (userData) => {
    setUser(userData)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            user ? (
              <Dashboard user={user} onSignOut={handleSignOut} />
            ) : (
              <Homepage />
            )
          } 
        />
        <Route 
          path="/signin" 
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <SignInUp onAuthSuccess={handleAuthSuccess} />
            )
          } 
        />
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


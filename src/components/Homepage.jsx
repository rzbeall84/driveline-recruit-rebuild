import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { User, BarChart3, Shield, Target, CheckCircle } from 'lucide-react'

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded mr-3"></div>
                <span className="text-xl font-bold text-gray-900">DriveLine Solutions</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium">HOME</Link>
                <Link to="/signin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">BECOME A RECRUITER</Link>
                <Link to="/contact" className="bg-yellow-500 text-white px-3 py-2 rounded-md text-sm font-medium">CONTACT US →</Link>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="hidden md:block">
              <Link to="/signin">
                <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">HOME</Link>
              <Link to="/signin" className="block px-3 py-2 text-gray-700 hover:text-blue-600">BECOME A RECRUITER</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">CONTACT US</Link>
              <Link to="/signin" className="block mt-2 ml-3">
                <Button variant="outline" className="border-pink-500 text-pink-500">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to<br />
            DriveLine Recruit
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-blue-100">
            The premier platform connecting talented recruiters with America's transportation 
            industry. Build your career while helping drivers find their perfect match.
          </p>
          <Link to="/signin">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg"
            >
              Start Your Journey →
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose DriveLine Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Why Choose DriveLine?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our cutting-edge platform provides everything you need to succeed as a transportation recruiter
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Advanced Recruiter Training & Tools */}
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Advanced Recruiter Training & Tools
                </h3>
                <p className="text-gray-600">
                  Our innovative systems and training center help our recruiters succeed
                </p>
              </div>
            </div>

            {/* Real-Time Analytics */}
            <div className="flex items-start space-x-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Real-Time Analytics
                </h3>
                <p className="text-gray-600">
                  Track your recruiting performance with detailed metrics, conversion rates, and earning insights.
                </p>
              </div>
            </div>

            {/* Compliance & Safety */}
            <div className="flex items-start space-x-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Compliance & Safety
                </h3>
                <p className="text-gray-600">
                  Built-in compliance tools ensure all drivers meet DOT regulations and safety requirements.
                </p>
              </div>
            </div>

            {/* Commission Tracking */}
            <div className="flex items-start space-x-4">
              <div className="bg-blue-800 p-3 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Commission Tracking
                </h3>
                <p className="text-gray-600">
                  Transparent commission structure with real-time tracking and automated payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unlock Your Potential Section */}
      <section className="py-16 bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
              Unlock Your Potential
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Join thousands of successful recruiters who have built thriving careers with DriveLine. 
              Our comprehensive platform and support system set you up for success from day one.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {[
                'Flexible work-from-home opportunities',
                'Competitive commission structure',
                'Comprehensive training program',
                'Advanced recruiting tools & technology',
                'Dedicated support team'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg"
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg"
            >
              Learn More About Opportunities →
            </Button>
          </div>
        </div>
      </section>

      {/* Ready to Start Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join the DriveLine family today and start building a rewarding career in transportation recruiting
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signin">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Sign Up Now →
              </Button>
            </Link>
            <Link to="/signin">
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* DriveLine Recruit */}
            <div>
              <h3 className="text-lg font-semibold mb-4">DriveLine Recruit</h3>
              <p className="text-blue-200 text-sm">
                Connecting talented recruiters with America's transportation industry.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/signin" className="text-blue-200 hover:text-white">Sign Up</Link></li>
                <li><Link to="/signin" className="text-blue-200 hover:text-white">Sign In</Link></li>
                <li><Link to="/pricing" className="text-blue-200 hover:text-white">Pricing</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="text-blue-200 hover:text-white">Contact Us</Link></li>
                <li><Link to="/faq" className="text-blue-200 hover:text-white">FAQ</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-blue-200 hover:text-white">About Us</Link></li>
                <li><Link to="/privacy" className="text-blue-200 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-blue-200 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-8 text-center">
            <p className="text-blue-200 text-sm">
              © 2025 DriveLine Recruit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage


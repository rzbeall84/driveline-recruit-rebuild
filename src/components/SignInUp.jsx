import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { signIn, signUp, submitRecruiterApplication } from '../lib/auth.js'
import { sendWelcomeEmail, sendAdminNotification } from '../lib/email.js'

const SignInUp = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('signup')
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Sign In Form Data
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  })

  // Multi-step Form Data
  const [formData, setFormData] = useState({
    // Step 1
    howDidYouHear: '',
    experience: '',
    isUSResident: '',
    // Step 2 - Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Step 3 - Background
    previousExperience: '',
    education: '',
    availability: '',
    // Step 4 - Final Details
    references: '',
    additionalInfo: ''
  })

  const totalSteps = 4
  const progressPercentage = (currentStep / totalSteps) * 100

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSignInChange = (field, value) => {
    setSignInData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await signIn(signInData.email, signInData.password)
    
    if (error) {
      setError(error)
    } else {
      setSuccess('Successfully signed in!')
      // Redirect to dashboard or home
      setTimeout(() => navigate('/'), 1500)
    }
    
    setLoading(false)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmitApplication = async () => {
    setLoading(true)
    setError('')

    // Validate required fields
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // First, create the user account
      const { data: authData, error: authError } = await signUp(
        formData.email, 
        formData.password,
        {
          first_name: formData.firstName,
          last_name: formData.lastName
        }
      )

      if (authError) {
        setError(authError)
        setLoading(false)
        return
      }

      // Then submit the recruiter application
      const applicationData = {
        user_id: authData.user?.id,
        how_did_you_hear: formData.howDidYouHear,
        experience: formData.experience,
        is_us_resident: formData.isUSResident === 'yes',
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        previous_experience: formData.previousExperience,
        education: formData.education,
        availability: formData.availability,
        references: formData.references,
        additional_info: formData.additionalInfo
      }

      const { data: appData, error: appError } = await submitRecruiterApplication(applicationData)

      if (appError) {
        setError(appError)
      } else {
        // Send welcome email to the new recruiter
        try {
          await sendWelcomeEmail(formData.email, formData.firstName, formData.lastName)
          console.log('Welcome email sent successfully')
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError)
          // Don't fail the application if email fails
        }

        // Send admin notification
        try {
          await sendAdminNotification(applicationData)
          console.log('Admin notification sent successfully')
        } catch (emailError) {
          console.error('Failed to send admin notification:', emailError)
          // Don't fail the application if email fails
        }

        setSuccess('Application submitted successfully! Please check your email for confirmation and next steps.')
        // Reset form or redirect
        setTimeout(() => {
          setActiveTab('signin')
          setCurrentStep(1)
          setFormData({
            howDidYouHear: '',
            experience: '',
            isUSResident: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            previousExperience: '',
            education: '',
            availability: '',
            references: '',
            additionalInfo: ''
          })
        }, 5000) // Increased timeout to give user time to read the success message
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    }

    setLoading(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How did you hear about us? *
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.howDidYouHear}
                onChange={(e) => handleInputChange('howDidYouHear', e.target.value)}
              >
                <option value="">Please select an option</option>
                <option value="google">Google Search</option>
                <option value="social">Social Media</option>
                <option value="referral">Referral</option>
                <option value="advertisement">Advertisement</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience *
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
              >
                <option value="">Please Select</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Are you a US Resident? *
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.isUSResident}
                onChange={(e) => handleInputChange('isUSResident', e.target.value)}
              >
                <option value="">Please Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input 
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input 
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input 
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input 
                type="tel"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input 
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input 
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Recruiting Experience
              </label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                value={formData.previousExperience}
                onChange={(e) => handleInputChange('previousExperience', e.target.value)}
                placeholder="Describe your previous recruiting experience..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
              >
                <option value="">Please Select</option>
                <option value="high-school">High School</option>
                <option value="associates">Associate's Degree</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
              >
                <option value="">Please Select</option>
                <option value="immediate">Immediate</option>
                <option value="2-weeks">2 weeks notice</option>
                <option value="1-month">1 month</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional References
              </label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                value={formData.references}
                onChange={(e) => handleInputChange('references', e.target.value)}
                placeholder="Please provide contact information for 2-3 professional references..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Is there anything else you'd like us to know about you?"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                By submitting this application, you agree to our Terms of Service and Privacy Policy. 
                We will review your application and contact you within 2-3 business days.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 text-center border-b">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to DriveLine Solutions
            </h1>
            <p className="text-gray-600">
              Sign in to access your recruiter dashboard
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'signin' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'signup' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'signin' ? (
              /* Sign In Form */
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                    value={signInData.email}
                    onChange={(e) => handleSignInChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input 
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) => handleSignInChange('password', e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                <div className="text-center">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot your password?
                  </a>
                </div>
              </form>
            ) : (
              /* Multi-Step Sign Up Form */
              <div>
                {/* Progress Header */}
                <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
                  <h2 className="text-lg font-semibold mb-2">
                    DriveLine Recruiter Application
                  </h2>
                  <div className="flex justify-between items-center text-sm">
                    <span>Step {currentStep} of {totalSteps}</span>
                    <span>{Math.round(progressPercentage)}% Complete</span>
                  </div>
                  <div className="w-full bg-blue-500 rounded-full h-2 mt-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Step Content */}
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1 || loading}
                    className="flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                      disabled={loading}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleSubmitApplication}
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInUp


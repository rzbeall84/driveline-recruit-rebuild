import { supabase } from './supabase.js'

// Sign up with email and password
export const signUp = async (email, password, userData = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

// Submit recruiter application
export const submitRecruiterApplication = async (applicationData) => {
  try {
    const { data, error } = await supabase
      .from('recruiter_applications')
      .insert([applicationData])
      .select()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}


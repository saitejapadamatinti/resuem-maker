import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// For development/demo purposes, using environment variables
// In production, these should be set in your hosting environment
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Authentication helper functions
export const authHelpers = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: error.message };
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: error.message };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error.message };
    }
  },

  // Get current user
  getCurrentUser() {
    return supabase.auth.getUser();
  },

  // Get current session
  getCurrentSession() {
    return supabase.auth.getSession();
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Resume data helper functions
export const resumeHelpers = {
  // Save resume data to user's profile
  async saveResume(resumeData, resumeName = 'My Resume') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('resumes')
        .upsert({
          user_id: user.id,
          name: resumeName,
          data: resumeData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,name'
        })
        .select();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Save resume error:', error);
      return { data: null, error: error.message };
    }
  },

  // Load resume data for current user
  async loadResumes() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Load resumes error:', error);
      return { data: null, error: error.message };
    }
  },

  // Delete a resume
  async deleteResume(resumeId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Delete resume error:', error);
      return { data: null, error: error.message };
    }
  }
};

export default supabase;
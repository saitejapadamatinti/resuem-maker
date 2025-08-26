# Supabase Database Setup for ATS Resume Builder

This document provides the SQL schema and setup instructions for the Supabase database to support user authentication and cloud resume storage.

## Database Schema

### 1. Resumes Table

```sql
-- Create the resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL DEFAULT 'My Resume',
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Ensure unique resume names per user
    UNIQUE(user_id, name)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON public.resumes(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own resumes
CREATE POLICY "Users can view own resumes" ON public.resumes
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own resumes
CREATE POLICY "Users can insert own resumes" ON public.resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own resumes
CREATE POLICY "Users can update own resumes" ON public.resumes
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own resumes
CREATE POLICY "Users can delete own resumes" ON public.resumes
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_resumes_updated_at ON public.resumes;
CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. User Profiles Table (Optional Enhancement)

```sql
-- Create user profiles table for additional user data
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually takes 2-3 minutes)

### 2. Configure Authentication

1. In your Supabase dashboard, go to **Authentication > Settings**
2. Enable email authentication if not already enabled
3. Configure email templates if desired
4. Set up any additional providers (Google, GitHub, etc.) if needed

### 3. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the SQL schema from above
3. Click "Run" to execute the queries

### 4. Get Your Project Credentials

1. Go to **Settings > API** in your Supabase dashboard
2. Copy your **Project URL** and **anon public key**
3. Create a `.env.local` file in your project root:

```env
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Test the Connection

1. Start your React development server: `npm start`
2. Try signing up with a test email
3. Check the Authentication tab in Supabase to see the new user
4. Try saving a resume and check the resumes table in the Table Editor

## Security Features

### Row Level Security (RLS)
- **Enabled on all tables**: Ensures users can only access their own data
- **Automatic user isolation**: Users cannot see or modify other users' resumes
- **Secure by default**: Even if there's a bug in the application, the database enforces security

### Data Privacy
- **Encrypted at rest**: All data is encrypted in Supabase's database
- **HTTPS only**: All API calls are made over secure connections
- **No sensitive data exposure**: Resume data is stored as JSONB and only accessible to the owner

### Authentication Security
- **JWT tokens**: Secure token-based authentication
- **Automatic token refresh**: Handles token expiration seamlessly
- **Email verification**: Optional email confirmation for new accounts

## API Usage Examples

### Save a Resume
```javascript
import { resumeHelpers } from './lib/supabase';

const resumeData = {
  contact: { fullName: "John Doe", email: "john@example.com" },
  // ... other resume sections
};

const { data, error } = await resumeHelpers.saveResume(resumeData, "Software Engineer Resume");
```

### Load User's Resumes
```javascript
const { data: resumes, error } = await resumeHelpers.loadResumes();
```

### Delete a Resume
```javascript
const { data, error } = await resumeHelpers.deleteResume(resumeId);
```

## Troubleshooting

### Common Issues

1. **"User not authenticated" error**
   - Make sure the user is signed in before making API calls
   - Check that the JWT token is valid

2. **RLS Policy errors**
   - Verify that RLS policies are created correctly
   - Check that the user ID matches the policy conditions

3. **Environment variables not loaded**
   - Ensure `.env.local` file is in the project root
   - Restart the development server after adding environment variables

4. **CORS errors**
   - Check that your domain is added to Supabase's allowed origins
   - Verify the Supabase URL and API key are correct

### Testing Checklist

- [ ] User can sign up with email
- [ ] User receives confirmation email (if enabled)
- [ ] User can sign in with credentials
- [ ] User can save resume data
- [ ] User can load saved resumes
- [ ] User can delete resumes
- [ ] User cannot see other users' data
- [ ] User is automatically signed out after token expiration

## Future Enhancements

### Planned Features
1. **Resume sharing**: Generate shareable links for resumes
2. **Team workspaces**: Collaborate on resumes with team members
3. **Version history**: Track changes to resumes over time
4. **Template library**: Save and share resume templates
5. **Analytics**: Track resume views and downloads

### Storage Optimization
1. **File attachments**: Store resume attachments (PDF, images) in Supabase Storage
2. **Data compression**: Compress large resume data for better performance
3. **Caching**: Implement client-side caching for faster loading

This setup provides a robust, secure foundation for user authentication and cloud resume storage in the ATS Resume Builder application.
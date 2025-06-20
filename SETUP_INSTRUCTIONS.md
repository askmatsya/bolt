# AskMatsya Database Setup Instructions

## 🔐 Security Notice
**NEVER commit actual database credentials to version control!**

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a secure database password (save it securely!)
3. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Credentials

From your Supabase dashboard:

### Project Settings > API
- Copy your **Project URL** 
- Copy your **anon/public key**
- Copy your **service_role key** (keep this secret!)

### Project Settings > Database
- Copy all connection strings:
  - Direct connection
  - Transaction pooler  
  - Session pooler

## Step 3: Create Environment File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
   # ... etc
   ```

## Step 4: Run Database Migrations

In your Supabase dashboard:

1. Go to **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/create_database_schema.sql`
3. Click **Run** to create all tables
4. Copy and paste the contents of `supabase/migrations/seed_initial_data.sql`  
5. Click **Run** to populate with sample data

## Step 5: Verify Setup

1. Check that all tables were created in **Table Editor**
2. Verify sample data exists in the `products` table
3. Test the connection by running the app:
   ```bash
   npm run dev
   ```

## Step 6: Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Database password is strong (12+ characters)
- [ ] Service role key is kept secret
- [ ] RLS policies are enabled on all tables
- [ ] Only necessary data is publicly accessible

## Troubleshooting

### Connection Issues
- Verify your project URL and keys are correct
- Check that your project is not paused
- Ensure you're using the correct database password

### Migration Errors
- Run migrations one at a time if there are errors
- Check the Supabase logs for detailed error messages
- Verify you have the necessary permissions

### RLS Policy Issues
- Test policies in the Supabase dashboard
- Use the "RLS disabled" mode temporarily for debugging
- Check that policies match your app's authentication flow

## Production Deployment

For production:
1. Use environment variables in your hosting platform
2. Enable additional security features in Supabase
3. Set up database backups
4. Monitor usage and performance
5. Consider upgrading to a paid plan for better performance

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the error logs in Supabase dashboard
3. Test database queries directly in the SQL editor
4. Verify your environment variables are loaded correctly
# 🚨 URGENT FIX: "Database error saving new user"

## Quick Solution (2 minutes):

### Method 1: Automatic Repair
1. Go to `/auth` page
2. Scroll down to "Auth Debug & Diagnostics"
3. Click **"🔧 Repair Database"** button
4. Wait for completion message
5. Try registering again

### Method 2: Manual SQL (Guaranteed Fix)
1. Open your Supabase dashboard
2. Go to **SQL Editor** → **New Query**
3. Copy and paste the entire contents of `database_setup_complete.sql`
4. Click **RUN**
5. You should see "Tables created successfully!" message
6. Try registering again

## What This Fixes:
- ✅ Creates the missing `profiles` table
- ✅ Sets up proper RLS (Row Level Security) policies  
- ✅ Creates automatic profile creation trigger
- ✅ Fixes the "Database error saving new user" error

## Verification:
After running the SQL, you should be able to:
- ✅ Register new users successfully
- ✅ See users in the profiles table
- ✅ Login and access the application

## Why This Happened:
The original `create_tables.sql` only created the messages table, but Supabase Auth requires a profiles table with proper policies for user registration to work.

---
**Need help?** Check the Auth Debug diagnostics for detailed error information.

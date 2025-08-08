# Database Setup Instructions

To enable the friends and messaging functionality, you need to create two new tables in your Supabase database.

## How to Create the Tables

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the content from `create_tables.sql` file
4. Execute the SQL script

## Tables Created

### 1. `friends` table
- Manages friend relationships between users
- Supports different statuses: pending, accepted, blocked
- Includes Row Level Security (RLS) policies

### 2. `messages` table  
- Stores private messages between users
- Tracks read/unread status
- Includes Row Level Security (RLS) policies

## What's Included

The SQL script includes:
- ✅ Table creation with proper relationships
- ✅ Indexes for optimal performance
- ✅ Row Level Security (RLS) policies
- ✅ Automatic timestamp triggers
- ✅ Proper foreign key constraints

## Testing the Setup

After running the SQL script, you can test the functionality by:
1. Creating user accounts
2. Sending friend requests
3. Accepting/rejecting friend requests
4. Sending private messages

All functionality is now available in the application interface.

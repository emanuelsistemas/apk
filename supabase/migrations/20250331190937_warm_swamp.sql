/*
  # Disable RLS for projects table

  1. Changes
    - Disable Row Level Security (RLS) for projects table
    - Drop existing RLS policies as they won't be needed
*/

-- Disable RLS for projects table
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Drop existing policies as they won't be needed anymore
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
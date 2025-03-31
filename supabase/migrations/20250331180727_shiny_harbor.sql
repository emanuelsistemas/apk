/*
  # Create projects table and storage

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `user_id` (uuid, required, references auth.users)
      - `app_link` (text)
      - `icon_url` (text)
      - `created_at` (timestamp with time zone)

  2. Storage
    - Create bucket for project icons

  3. Security
    - Enable RLS on projects table
    - Add policies for CRUD operations
    - Set up storage policies
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_link text,
  icon_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for project icons
INSERT INTO storage.buckets (id, name)
VALUES ('project-icons', 'project-icons')
ON CONFLICT DO NOTHING;

-- Set up storage policies
CREATE POLICY "Anyone can view project icons"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'project-icons');

CREATE POLICY "Authenticated users can upload project icons"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-icons');

CREATE POLICY "Users can update their own project icons"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-icons');

CREATE POLICY "Users can delete their own project icons"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-icons');
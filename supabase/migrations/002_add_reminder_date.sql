-- Add reminder_date column to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS reminder_date date;

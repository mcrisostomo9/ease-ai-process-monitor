-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  guideline TEXT NOT NULL,
  result VARCHAR(20) NOT NULL CHECK (result IN ('COMPLIES', 'DEVIATES', 'UNCLEAR')),
  confidence DECIMAL(5, 4) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create saved_guidelines table
CREATE TABLE IF NOT EXISTS saved_guidelines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_submissions_timestamp ON submissions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_saved_guidelines_created_at ON saved_guidelines(created_at DESC);

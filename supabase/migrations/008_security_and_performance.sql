-- =============================================================================
-- MIGRATION: Security, Performance, and Gamification
-- =============================================================================

-- 1. Enable RLS on all tables (if not already enabled)
ALTER TABLE IF EXISTS properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tasks ENABLE ROW LEVEL SECURITY; -- Assuming 'tasks' exists

-- 2. Create 'daily_tasks' table for Gamification
CREATE TABLE IF NOT EXISTS daily_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    task_date DATE NOT NULL DEFAULT CURRENT_DATE,
    task_type TEXT NOT NULL, -- e.g., 'call', 'meeting', 'update'
    target_count INTEGER NOT NULL DEFAULT 1,
    current_count INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    xp_reward INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, task_date, task_type)
);

-- RLS for daily_tasks
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS daily_tasks_access_policy ON daily_tasks;
CREATE POLICY daily_tasks_access_policy ON daily_tasks
    FOR ALL USING (user_id = auth.uid());

-- 3. Performance Indexes
-- Properties
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON properties(created_by);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Deals
CREATE INDEX IF NOT EXISTS idx_deals_assigned_to ON deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_assigned_to ON appointments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);

-- Daily Tasks
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_date ON daily_tasks(user_id, task_date);

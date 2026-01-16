-- =============================================================================
-- RLS Policy Fixes - Basitleştirilmiş versiyon
-- Kullanıcı kendi oluşturduğu/atandığı kayıtlara erişebilir
-- =============================================================================

-- Properties - sadece created_by kontrolü
DROP POLICY IF EXISTS property_workspace_policy ON properties;
DROP POLICY IF EXISTS property_access_policy ON properties;

CREATE POLICY property_access_policy ON properties
    FOR ALL USING (created_by = auth.uid());

-- Customers - sadece assigned_to kontrolü
DROP POLICY IF EXISTS customer_workspace_policy ON customers;
DROP POLICY IF EXISTS customer_access_policy ON customers;

CREATE POLICY customer_access_policy ON customers
    FOR ALL USING (assigned_to = auth.uid());

-- Deals - sadece assigned_to kontrolü
DROP POLICY IF EXISTS deal_workspace_policy ON deals;
DROP POLICY IF EXISTS deal_access_policy ON deals;

CREATE POLICY deal_access_policy ON deals
    FOR ALL USING (assigned_to = auth.uid());

-- Appointments - sadece assigned_to kontrolü
DROP POLICY IF EXISTS appointment_workspace_policy ON appointments;
DROP POLICY IF EXISTS appointment_access_policy ON appointments;

CREATE POLICY appointment_access_policy ON appointments
    FOR ALL USING (assigned_to = auth.uid());

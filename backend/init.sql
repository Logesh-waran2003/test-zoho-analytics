-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    tenant_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form data table
CREATE TABLE IF NOT EXISTS form_data (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    field_1 TEXT,
    field_2 TEXT,
    field_3 TEXT,
    field_4 TEXT,
    field_5 TEXT,
    field_6 TEXT,
    field_7 TEXT,
    field_8 TEXT,
    field_9 TEXT,
    field_10 TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for tenant_id
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_form_data_tenant_id ON form_data(tenant_id);

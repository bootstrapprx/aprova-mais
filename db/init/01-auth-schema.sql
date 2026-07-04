-- Create the auth schema required by GoTrue
CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION postgres;

-- Pre-create the factor_type enum so the phone MFA migration works
DO $$
BEGIN
  CREATE TYPE auth.factor_type AS ENUM ('totp', 'webauthn', 'phone');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

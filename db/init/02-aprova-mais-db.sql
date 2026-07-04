-- Create the application database (idempotent via shell wrapper)
SELECT 'CREATE DATABASE aprova_mais'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'aprova_mais')\gexec

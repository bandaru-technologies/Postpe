-- PostPe Database Initialization
-- Extensions (database is created by POSTGRES_DB env var)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Full text search index will be created after JPA creates the tables

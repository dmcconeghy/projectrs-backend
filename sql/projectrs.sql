\echo 'Delete and recreate projectRS db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE projectrs;
CREATE DATABASE projectrs;
\connect projectrs

\i projectrs-schema.sql
-- \i jobly-seed.sql

\echo 'Delete and recreate projectrs_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE projectrs_test;
CREATE DATABASE projectrs_test;
\connect projectrs_test

\i projectrs-schema.sql

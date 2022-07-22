-- \c projectrs

-- with types_json (doc) as (
--     values
--     ('[ 
--         { "name": "podcast" }, 
--         { "name": "transcript" }, 
--         { "name": "response" }, 
--         { "name": "tag" }, 
--         { "name": "contributor" }, 
--         { "name": "editor" }
--     ]'::json)
-- )
-- insert into types (name)
-- select p.* from types_json l
--     cross join lateral json_populate_recordset(null::types, doc) as p
--     on conflict (name) do nothing;

-- json_array_elements (json) -> setof json
-- select * from json_object_keys('{
--         "podcast": "podcast",
--         "response": "response",
--         "persons": "persons",
--         "transcript": "transcript",
--         "playlist": "playlist",
--         "opportunities": "opportunities"
--     }')

BEGIN;
create temp table temp_json (values text) on commit drop;
copy temp_json from '/home/dbd/projectRS/projectrs-backend/sql/types.json';
\c projectrs
insert into types ("name")

select values->>'name' as name
from (select json_array_elements(::json) as values from temp_json;
SELECT * from types;
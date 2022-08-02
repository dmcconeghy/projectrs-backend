CREATE TABLE types (
  name TEXT PRIMARY KEY UNIQUE
);

CREATE TABLE contributors (
  contributor_id INTEGER PRIMARY KEY UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL, 
  bio_text TEXT NOT NULL,
  profile_image INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'persons'
    REFERENCES types(name)
);

CREATE TABLE tags (
  tag_id INTEGER PRIMARY KEY UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL, 
  count INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE editors (
  editor_id INTEGER PRIMARY KEY UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL, 
  avatar_image_url TEXT NOT NULL DEFAULT 'https://www.gravatar.com/avatar/?d=mp'
);

CREATE TABLE podcasts (
  podcast_id INTEGER PRIMARY KEY UNIQUE,
  date_created TIMESTAMP NOT NULL DEFAULT NOW(),
  podcast_post_url TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  featured_image INTEGER NOT NULL DEFAULT 0,
  featured_image_url TEXT NOT NULL DEFAULT 'https://www.religiousstudiesproject.com/wp-content/uploads/2022/02/new_logo_large_1400x1400.png'
  editor INTEGER NOT NULL
    REFERENCES editors(editor_id),
  mp3_file_url TEXT NOT NULL DEFAULT 'not found',
  type TEXT NOT NULL DEFAULT 'podcast'
    REFERENCES types(name) 
);

-- Tags and contributors are many-to-many relationships for podcasts through the podcast_tags and podcast_contributors tables

CREATE TABLE podcast_tags (
  podcast_id INTEGER NOT NULL
    REFERENCES podcasts(podcast_id),
  tag_id INTEGER NOT NULL
    REFERENCES tags(tag_id),
  PRIMARY KEY(podcast_id, tag_id)
);

CREATE TABLE podcast_contributors (
  podcast_id INTEGER NOT NULL
    REFERENCES podcasts(podcast_id),
  contributor_id INTEGER NOT NULL
    REFERENCES contributors(contributor_id),
  PRIMARY KEY(podcast_id, contributor_id)
);

CREATE TABLE transcripts (
  transcript_id INTEGER PRIMARY KEY UNIQUE,
  date_created TIMESTAMP NOT NULL DEFAULT NOW(),
  podcast_id INTEGER NOT NULL
    REFERENCES podcasts(podcast_id),
  content TEXT NOT NULL,
  transcibed_by INTEGER NOT NULL
    REFERENCES contributors(contributor_id),
  tags INTEGER NOT NULL
    REFERENCES tags(tag_id),
  editor INTEGER NOT NULL
    REFERENCES editors(editor_id),
  type TEXT NOT NULL DEFAULT 'transcript'
    REFERENCES types(name) 
);

ALTER TABLE podcasts
  ADD transcript INTEGER
    REFERENCES transcripts(transcript_id);

CREATE TABLE responses (
  response_id INTEGER PRIMARY KEY UNIQUE,
  date_created TIMESTAMP NOT NULL DEFAULT NOW(),
  podcast_id INTEGER NOT NULL
    REFERENCES podcasts(podcast_id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  featured_image INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'response'
    REFERENCES types(name) 
);

CREATE TABLE response_contributors(
  response_id INTEGER NOT NULL
    REFERENCES responses(response_id),
  contributor_id INTEGER NOT NULL
    REFERENCES contributors(contributor_id),
  PRIMARY KEY(response_id, contributor_id)
);


-- A handful of responses may have multiple authors and make it necessary to have a many-to-many relationship for responses and contributors.

CREATE TABLE podcast_responses (
  podcast_id INTEGER NOT NULL
    REFERENCES podcasts(podcast_id),
  response_id INTEGER NOT NULL
    REFERENCES responses(response_id),
  PRIMARY KEY(podcast_id, response_id)
);

INSERT INTO editors (
  editor_id,
  name, 
  slug, 
  avatar_image_url) 
VALUES (
  0, 
  'Editorial Team', 
  'editors', 
  'https://www.gravatar.com/avatar/?d=mp');

INSERT INTO podcasts (podcast_id, 
  date_created, 
  podcast_post_url, 
  slug, 
  title, 
  content, 
  excerpt, 
  featured_image, 
  editor, 
  mp3_file_url, 
  type) 
VALUES (
  0, 
  '2012-01-01T00:00:00', 
  'htttps://religiousstudiesproject.com', 
  'sample-podcast', 
  'Sample Podcast', 
  'Sample content', 
  'Sample excerpt', 
  0, 
  0, 
  'https://www.example.com/podcast-1.mp3', 
  'podcast');
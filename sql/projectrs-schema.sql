CREATE TABLE podcasts (
  id INTEGER PRIMARY KEY,
  date_created TIMESTAMP NOT NULL DEFAULT NOW(),
  link TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author INTEGER NOT NULL,
  featured_image INTEGER NOT NULL DEFAULT 0,
  categories TEXT NOT NULL,
  tags TEXT NOT NULL,
  contributors TEXT NOT NULL,
  transcript INTEGER NOT NULL DEFAULT 0,
  mp3_file TEXT NOT NULL
);
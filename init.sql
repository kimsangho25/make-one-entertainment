CREATE SCHEMA IF NOT EXISTS moe;

CREATE TABLE IF NOT EXISTS moe.media (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT NULL,
  category      TEXT NOT NULL,
  event_date    TIMESTAMPTZ NULL,
  media_type    TEXT NOT NULL CHECK (media_type IN ('image','video')),
  media_url     TEXT NULL,
  image_urls    TEXT[] NULL,
  display_order INT  NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_category      ON moe.media(category);
CREATE INDEX IF NOT EXISTS idx_media_media_type    ON moe.media(media_type);
CREATE INDEX IF NOT EXISTS idx_media_event_date    ON moe.media(event_date);
CREATE INDEX IF NOT EXISTS idx_media_display_order ON moe.media(display_order);

CREATE TABLE IF NOT EXISTS moe.reviews (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author          TEXT NOT NULL,
  rating          INT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content         TEXT NOT NULL,
  event_type      TEXT NULL,
  event_date      TIMESTAMPTZ NULL,
  image_urls      TEXT[] NULL,
  likes_count     INT NOT NULL DEFAULT 0,
  reports_count   INT NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'published',
  created_ip_hash TEXT NULL,
  created_ua      TEXT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_status      ON moe.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at  ON moe.reviews(created_at);

CREATE TABLE IF NOT EXISTS moe.review_likes (
  review_id BIGINT NOT NULL REFERENCES moe.reviews(id) ON DELETE CASCADE,
  client_id TEXT   NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (review_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_review_likes_client ON moe.review_likes(client_id);

CREATE TABLE IF NOT EXISTS moe.review_reports (
  review_id BIGINT NOT NULL REFERENCES moe.reviews(id) ON DELETE CASCADE,
  client_id TEXT   NOT NULL,
  reason    TEXT   NOT NULL,
  details   TEXT   NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (review_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_review_reports_client ON moe.review_reports(client_id);
BEGIN;
CREATE TABLE IF NOT EXISTS cms_documents (
  kind text NOT NULL CHECK (kind IN ('home','about','contact','course','trainer','gallery','testimonial','placement','seo','page')),
  id text NOT NULL,
  draft jsonb NOT NULL CHECK (jsonb_typeof(draft)='object'),
  previous_seo jsonb,
  published jsonb CHECK (jsonb_typeof(published)='object'),
  withdrawn boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (kind,id)
);
CREATE INDEX IF NOT EXISTS cms_public_items ON cms_documents(kind) WHERE published IS NOT NULL OR withdrawn;
CREATE TABLE IF NOT EXISTS cms_history (
  event_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kind text NOT NULL, id text NOT NULL, version integer NOT NULL,
  action text NOT NULL CHECK (action IN ('publish','unpublish')),
  actor_id text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(kind,id) REFERENCES cms_documents(kind,id), UNIQUE(kind,id,version)
);
CREATE TABLE IF NOT EXISTS cms_media (
  id uuid PRIMARY KEY, name text NOT NULL, category text NOT NULL DEFAULT '',
  mime text NOT NULL, size integer NOT NULL CHECK (size BETWEEN 1 AND 4194304),
  provider text NOT NULL CHECK(provider IN ('local','cloudinary')),
  storage_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE cms_media ADD COLUMN IF NOT EXISTS deleting boolean NOT NULL DEFAULT false;
CREATE TABLE IF NOT EXISTS cms_media_usage (
  kind text NOT NULL, id text NOT NULL, media_id uuid NOT NULL REFERENCES cms_media(id),
  stage text NOT NULL CHECK(stage IN ('draft','published')),
  PRIMARY KEY(kind,id,media_id,stage), FOREIGN KEY(kind,id) REFERENCES cms_documents(kind,id)
);
CREATE INDEX IF NOT EXISTS cms_media_lookup ON cms_media_usage(media_id,stage);
COMMIT;

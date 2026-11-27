BEGIN;
ALTER TABLE cms_documents DROP CONSTRAINT IF EXISTS cms_documents_kind_check;
ALTER TABLE cms_documents ADD CONSTRAINT cms_documents_kind_check
  CHECK (kind IN ('home','about','contact','course','trainer','gallery','testimonial','placement','seo','page'));
COMMIT;

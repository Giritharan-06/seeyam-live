BEGIN;
CREATE TABLE IF NOT EXISTS ops_students (
 id uuid PRIMARY KEY, name text NOT NULL, email text NOT NULL, phone text NOT NULL DEFAULT '',
 lead_id text UNIQUE REFERENCES leads(id) ON DELETE SET NULL,
 status text NOT NULL CHECK(status IN ('Active','Inactive','Graduated')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS ops_students_email ON ops_students(lower(email));
CREATE TABLE IF NOT EXISTS ops_trainers (
 id uuid PRIMARY KEY, name text NOT NULL, email text NOT NULL, specialty text NOT NULL,
 status text NOT NULL CHECK(status IN ('Active','Inactive')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ops_enrolments (
 id uuid PRIMARY KEY, student_id uuid NOT NULL REFERENCES ops_students(id),
 batch_id text NOT NULL REFERENCES batches(id), status text NOT NULL CHECK(status IN ('Enrolled','Completed','Withdrawn')),
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(student_id,batch_id)
);
CREATE TABLE IF NOT EXISTS ops_assignments (
 id uuid PRIMARY KEY, trainer_id uuid NOT NULL REFERENCES ops_trainers(id),
 batch_id text NOT NULL REFERENCES batches(id), created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(trainer_id,batch_id)
);
CREATE TABLE IF NOT EXISTS ops_jobs (
 id uuid PRIMARY KEY, title text NOT NULL, company text NOT NULL, description text NOT NULL,
 status text NOT NULL CHECK(status IN ('Open','Closed')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ops_applications (
 id uuid PRIMARY KEY, student_id uuid NOT NULL REFERENCES ops_students(id),
 job_id uuid NOT NULL REFERENCES ops_jobs(id),
 status text NOT NULL CHECK(status IN ('Submitted','Interview','Offered','Rejected','Withdrawn')),
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(student_id,job_id)
);
CREATE TABLE IF NOT EXISTS ops_placements (
 id uuid PRIMARY KEY, application_id uuid UNIQUE NOT NULL REFERENCES ops_applications(id),
 placed_on date NOT NULL, notes text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ops_payments (
 id uuid PRIMARY KEY, enrolment_id uuid NOT NULL REFERENCES ops_enrolments(id),
 amount numeric(12,2) NOT NULL CHECK(amount>0), reference text NOT NULL UNIQUE, paid_on date NOT NULL,
 status text NOT NULL CHECK(status IN ('Recorded','Voided')), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ops_notifications (
 id uuid PRIMARY KEY, title text NOT NULL, body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ops_notification_reads (
 notification_id uuid NOT NULL REFERENCES ops_notifications(id), reader_id text NOT NULL,
 PRIMARY KEY(notification_id,reader_id)
);
CREATE INDEX IF NOT EXISTS ops_enrolments_batch ON ops_enrolments(batch_id);
CREATE INDEX IF NOT EXISTS ops_assignments_batch ON ops_assignments(batch_id);
CREATE INDEX IF NOT EXISTS ops_applications_job ON ops_applications(job_id);
CREATE INDEX IF NOT EXISTS ops_payments_enrolment ON ops_payments(enrolment_id);
COMMIT;

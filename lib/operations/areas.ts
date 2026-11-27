type Field = { key: string; label: string; type?: "email" | "date" | "amount" | "long"; options?: string[]; source?: string; optional?: boolean; fixed?: boolean };
const choice = (key: string, label: string, source: string, fixed = true): Field => ({ key, label, source, fixed });
const status = (...options: string[]): Field => ({ key: "status", label: "Status", options });

export const areas = {
 students: { title: "Students", singular: "student", description: "Register learners or convert an existing enquiry.", fields: [
  { ...choice("lead_id", "Import from enquiry", "leads"), optional: true },
  { key: "name", label: "Full name" }, { key: "email", label: "Email", type: "email" }, { key: "phone", label: "Phone", optional: true }, status("Active", "Inactive", "Graduated"),
 ] },
 trainers: { title: "Trainers", singular: "trainer", description: "Maintain instructor records and track their availability.", fields: [
  { key: "name", label: "Full name" }, { key: "email", label: "Work email", type: "email" }, { key: "specialty", label: "Specialty" }, status("Active", "Inactive"),
 ] },
 enrolments: { title: "Enrolments", singular: "enrolment", description: "Assign students to scheduled course batches.", fields: [
  choice("student_id", "Student", "students"), choice("batch_id", "Course batch", "batches"), status("Enrolled", "Completed", "Withdrawn"),
 ] },
 assignments: { title: "Trainer assignments", singular: "assignment", description: "Assign instructors to batches and review existing assignments.", fields: [
  choice("trainer_id", "Trainer", "trainers", false), choice("batch_id", "Course batch", "batches", false),
 ] },
 jobs: { title: "Job openings", singular: "job", description: "Record partner job openings and close filled listings.", fields: [
  { key: "title", label: "Job title" }, { key: "company", label: "Company" }, { key: "description", label: "Description", type: "long" }, status("Open", "Closed"),
 ] },
 applications: { title: "Applications", singular: "application", description: "Track student applications through interviews and offers.", fields: [
  choice("student_id", "Student", "students"), choice("job_id", "Job opening", "jobs"), status("Submitted", "Interview", "Offered", "Rejected", "Withdrawn"),
 ] },
 placements: { title: "Placements", singular: "placement", description: "Record placements against accepted job offers.", fields: [
  choice("application_id", "Offered application", "offers"), { key: "placed_on", label: "Placement date", type: "date" }, { key: "notes", label: "Notes", type: "long", optional: true },
 ] },
 payments: { title: "Payments", singular: "payment", description: "Log received payments in INR and void incorrect entries.", fields: [
  choice("enrolment_id", "Enrolment", "enrolments"), { key: "amount", label: "Amount (INR)", type: "amount", fixed: true },
  { key: "reference", label: "Payment reference", fixed: true }, { key: "paid_on", label: "Payment date", type: "date", fixed: true }, status("Recorded", "Voided"),
 ] },
 notifications: { title: "Notifications", singular: "announcement", description: "Post staff announcements and manage your unread inbox.", fields: [
  { key: "title", label: "Subject" }, { key: "body", label: "Message", type: "long" },
 ] },
} satisfies Record<string, { title: string; singular: string; description: string; fields: Field[] }>;

export type Area = keyof typeof areas;
export const isArea = (area: string): area is Area => Object.hasOwn(areas, area);
export const getFields = (area: Area): Field[] => areas[area].fields;
export const staffArea = (area: Area) => ["students","enrolments","jobs","applications","placements","notifications"].includes(area);
export type RecordRow = Record<string, string | null> & { id: string; created_at: string };
export type Option = { id: string; label: string; email?: string | null; phone?: string | null };

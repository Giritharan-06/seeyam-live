import "server-only";
import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { getSession, hasSecureAdminConfiguration } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getFields, staffArea, type Area, type Option, type RecordRow } from "./areas";

export async function operationsUser(area: Area | "reports", write = false) {
  const user = await getSession();
  if (!hasSecureAdminConfiguration || !user || (user.role !== "ADMIN" &&
    (area === "reports" || !staffArea(area) || (write && area === "notifications")))) return null;
  return user;
}

const optionsSql = {
  leads: Prisma.sql`SELECT id, "fullName" || ' · ' || email AS label, email, phone FROM leads ORDER BY "createdAt" DESC`,
  students: Prisma.sql`SELECT id::text, name || ' · ' || email AS label FROM ops_students ORDER BY name`,
  trainers: Prisma.sql`SELECT id::text, name || ' · ' || specialty AS label FROM ops_trainers ORDER BY name`,
  batches: Prisma.sql`SELECT b.id, c.title || ' · ' || br.name || ' · ' || to_char(b."startDate",'YYYY-MM-DD') AS label FROM batches b JOIN courses c ON c.id=b."courseId" JOIN branches br ON br.id=b."branchId" ORDER BY b."startDate" DESC`,
  jobs: Prisma.sql`SELECT id::text, title || ' · ' || company AS label FROM ops_jobs ORDER BY title`,
  offers: Prisma.sql`SELECT a.id::text, s.name || ' · ' || j.title || ' · ' || j.company AS label FROM ops_applications a JOIN ops_students s ON s.id=a.student_id JOIN ops_jobs j ON j.id=a.job_id WHERE a.status='Offered' ORDER BY s.name`,
  enrolments: Prisma.sql`SELECT e.id::text, s.name || ' · ' || c.title AS label FROM ops_enrolments e JOIN ops_students s ON s.id=e.student_id JOIN batches b ON b.id=e.batch_id JOIN courses c ON c.id=b."courseId" ORDER BY s.name`,
};

const table = (area: Area) => Prisma.raw('"ops_' + area + '"');
export async function operationsData(area: Area, readerId: string) {
  const fields = getFields(area);
  const columns = Prisma.join(fields.map(field => Prisma.raw('"' + field.key + '"::text')));
  const rows = await prisma.$queryRaw<RecordRow[]>`SELECT t.id::text, ${columns}, t.created_at::text
    ${area === "notifications" ? Prisma.sql`, CASE WHEN r.reader_id IS NULL THEN 'no' ELSE 'yes' END AS seen` : Prisma.empty}
    FROM ${table(area)} t
    ${area === "notifications" ? Prisma.sql`LEFT JOIN ops_notification_reads r ON r.notification_id=t.id AND r.reader_id=${readerId}` : Prisma.empty}
    ORDER BY t.created_at DESC`;
  const sources = [...new Set(fields.flatMap(field => field.source ? [field.source as keyof typeof optionsSql] : []))];
  const options: Record<string, Option[]> = {};
  for (const source of sources) options[source] = await prisma.$queryRaw<Option[]>(optionsSql[source]);
  return { rows, options };
}

export async function saveRecord(area: Area, id: string | null, input: Record<string,string>) {
  const fields = getFields(area);
  await prisma.$transaction(async tx => {
    const [current] = id ? await tx.$queryRaw<Record<string,string>[]> `SELECT * FROM ${table(area)} WHERE id=${id}::uuid FOR UPDATE` : [];
    if (id && !current) throw Error("This record no longer exists.");
    const values = { ...input };
    if (area === "students" && !id && values.lead_id) {
      const lead = await tx.lead.findUnique({ where: { id: values.lead_id } });
      if (!lead) throw Error("That enquiry no longer exists.");
      values.name = lead.fullName;
      values.email = lead.email;
      values.phone = lead.phone;
    }
    if (!id && area === "applications") {
      const [job] = await tx.$queryRaw<{status:string}[]>`SELECT status FROM ops_jobs WHERE id=${values.job_id}::uuid FOR SHARE`;
      if (job?.status !== "Open") throw Error("Choose an open job.");
    }
    if (!id && area === "placements") {
      const [offer] = await tx.$queryRaw<{status:string}[]>`SELECT status FROM ops_applications WHERE id=${values.application_id}::uuid FOR UPDATE`;
      if (offer?.status !== "Offered") throw Error("Set the application status to Offered before recording a placement.");
    }
    if (area === "applications" && current && values.status !== "Offered") {
      const [placement] = await tx.$queryRaw<{id:string}[]>`SELECT id FROM ops_placements WHERE application_id=${id}::uuid`;
      if (placement) throw Error("This application has a placement and must stay Offered.");
    }
    if (area === "payments" && current?.status === "Voided") throw Error("A voided payment is final. Record a new payment if needed.");
    const active = fields.filter(field => !id || !field.fixed);
    const pairs = active.map(field => {
      const value = typeof values[field.key] === "string" ? values[field.key].trim() : "";
      if ((!field.optional && !value) || value.length > (field.type === "long" ? 4000 : 250) || (field.options && !field.options.includes(value))) throw Error("Check " + field.label + ".");
      if (field.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) throw Error("Check " + field.label + ".");
      if (field.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw Error("Check " + field.label + ".");
      if (field.type === "amount" && (!/^\d{1,10}(\.\d{1,2})?$/.test(value) || Number(value) <= 0)) throw Error("Check Amount (INR).");
      const key = Prisma.raw('"' + field.key + '"');
      const val = field.type === "amount" ? Prisma.sql`${value}::numeric` : field.type === "date" ? Prisma.sql`${value}::date` :
        field.source && !["leads","batches"].includes(field.source) ? Prisma.sql`${value}::uuid` : Prisma.sql`${field.source && !value ? null : value}`;
      return { key, val };
    });
    if (id) await tx.$executeRaw`UPDATE ${table(area)} SET ${Prisma.join(pairs.map(({key,val}) => Prisma.sql`${key}=${val}`))} WHERE id=${id}::uuid`;
    else await tx.$executeRaw`INSERT INTO ${table(area)} (id,${Prisma.join(pairs.map(p => p.key))}) VALUES (${randomUUID()}::uuid,${Prisma.join(pairs.map(p => p.val))})`;
  });
}

export async function reportData() {
  return prisma.$queryRaw<{ students:number; enrolled:number; trainers:number; jobs:number; interviews:number; offers:number; placements:number; receipts:string }[]>`
   SELECT (SELECT count(*)::int FROM ops_students WHERE status='Active') AS students,
   (SELECT count(*)::int FROM ops_enrolments WHERE status='Enrolled') AS enrolled,
   (SELECT count(*)::int FROM ops_trainers WHERE status='Active') AS trainers,
   (SELECT count(*)::int FROM ops_jobs WHERE status='Open') AS jobs,
   (SELECT count(*)::int FROM ops_applications WHERE status='Interview') AS interviews,
   (SELECT count(*)::int FROM ops_applications WHERE status='Offered') AS offers,
   (SELECT count(*)::int FROM ops_placements) AS placements,
   (SELECT COALESCE(sum(amount),0)::text FROM ops_payments WHERE status='Recorded') AS receipts`;
}

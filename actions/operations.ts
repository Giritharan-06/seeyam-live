"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { isArea } from "@/lib/operations/areas";
import { operationsUser,saveRecord } from "@/lib/operations/store";

const uuid = /^[a-f0-9-]{36}$/i;
export async function getNotificationInbox() {
 const user = await operationsUser("notifications");
 if (!user) return null;
 try {
  const [items, counts] = await prisma.$transaction([
   prisma.$queryRaw<{id:string; title:string; body:string; unread:boolean}[]>`
    SELECT n.id::text,n.title,n.body,r.reader_id IS NULL AS unread
    FROM ops_notifications n LEFT JOIN ops_notification_reads r ON r.notification_id=n.id AND r.reader_id=${user.id}
    ORDER BY n.created_at DESC,n.id DESC LIMIT 8`,
   prisma.$queryRaw<{total:number}[]>`SELECT count(*)::int AS total FROM ops_notifications n
    WHERE NOT EXISTS (SELECT 1 FROM ops_notification_reads r WHERE r.notification_id=n.id AND r.reader_id=${user.id})`,
  ]);
  return {items, unread:counts[0].total};
 } catch { return null; }
}
export async function updateOperation(area:string,id:string|null,values:Record<string,string>){
 if(!isArea(area) || (id && !uuid.test(id)) || !await operationsUser(area,true)) return {ok:false,message:"You do not have access to change this record."};
 try {
  await saveRecord(area,id,values);
  revalidatePath("/admin","layout");
  return {ok:true,message:id?"Record updated.":"Record created."};
 } catch(error) {
  const e=error as {code?:string;meta?:{code?:string};message?:string};
  const reason=e.meta?.code;
  const message=reason==="23505"?"A record with these details already exists.":
   reason==="23503"?"A selected record is no longer available.":
   e.message && /^(Check |That enquiry|This record|Choose an open job|Set the application|This application|A voided payment)/.test(e.message)?e.message:"Could not save this record. Check your entries and try again.";
  return {ok:false,message};
 }
}
export async function setNotificationRead(id:string,read:boolean){
 const user=await operationsUser("notifications");
 if(!user || !uuid.test(id))return {ok:false,message:"Notification unavailable."};
 try {
  if(read) await prisma.$executeRaw`INSERT INTO ops_notification_reads(notification_id,reader_id)
    SELECT id,${user.id} FROM ops_notifications WHERE id=${id}::uuid ON CONFLICT DO NOTHING`;
  else await prisma.$executeRaw`DELETE FROM ops_notification_reads WHERE notification_id=${id}::uuid AND reader_id=${user.id}`;
  revalidatePath("/admin/operations/notifications");
  return {ok:true,message:read?"Marked as read.":"Marked as unread."};
 }catch{return {ok:false,message:"Could not update notification."};}
}
export async function removeAssignment(id:string){
 if(!uuid.test(id)||!await operationsUser("assignments",true)) return {ok:false,message:"Administrator access required."};
 try {
  await prisma.$executeRaw`DELETE FROM ops_assignments WHERE id=${id}::uuid`;
  revalidatePath("/admin/operations/assignments");
  return {ok:true,message:"Assignment removed."};
 } catch { return {ok:false,message:"Could not remove assignment."}; }
}

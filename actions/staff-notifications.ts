"use server";

import { prisma } from "@/lib/db";
import { operationsUser } from "@/lib/operations/store";

export interface StaffNotice {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export async function getStaffInbox() {
  const user = await operationsUser("notifications");
  if (!user) return null;
  try {
    const [rows, counts, preference] = await prisma.$transaction([
      prisma.$queryRaw<StaffNotice[]>`
        SELECT n.id::text, n.title, n.body, n.created_at::text AS "createdAt",
               (r.reader_id IS NOT NULL) AS read
        FROM ops_notifications n LEFT JOIN ops_notification_reads r
          ON r.notification_id = n.id AND r.reader_id = ${user.id}
        ORDER BY n.created_at DESC, n.id DESC LIMIT 8
      `,
      prisma.$queryRaw<{ total: number }[]>`
        SELECT count(*)::int AS total FROM ops_notifications n
        WHERE NOT EXISTS (
          SELECT 1 FROM ops_notification_reads r
          WHERE r.notification_id = n.id AND r.reader_id = ${user.id}
        )
      `,
      prisma.siteSetting.findUnique({ where: { key: "staff_popups:" + user.id } }),
    ]);
    return { rows, unread: counts[0].total, popups: preference?.value !== false };
  } catch {
    return null;
  }
}

export async function saveStaffPopupPreference(enabled: boolean) {
  const user = await operationsUser("notifications");
  if (!user || typeof enabled !== "boolean") return false;
  try {
    const key = "staff_popups:" + user.id;
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: enabled },
      update: { value: enabled },
    });
    return true;
  } catch {
    return false;
  }
}

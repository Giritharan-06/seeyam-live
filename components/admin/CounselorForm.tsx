"use client";
import { useActionState } from "react";
import { saveCounselor } from "@/actions/counselors";

type Account = { id: string; name: string; email: string; active: boolean };
const input = "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2";

export default function CounselorForm({ account, enabled }: { account?: Account; enabled: boolean }) {
  const [message, action, pending] = useActionState(saveCounselor, "");
  return <form action={action} className="space-y-3">
    <fieldset disabled={!enabled || pending} className="grid gap-3 text-sm sm:grid-cols-2">
      {account && <input type="hidden" name="id" value={account.id} />}
      <label>Name<input className={input} name="name" defaultValue={account?.name} required maxLength={100} /></label>
      <label>Work email<input className={input} type="email" name="email" defaultValue={account?.email} required maxLength={254} /></label>
      <label>{account ? "New password (optional)" : "Initial password"}<input className={input} type="password" name="password" autoComplete="new-password" minLength={12} maxLength={256} required={!account} /></label>
      {account && <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={account.active} />Allow sign-in</label>}
      <button className="w-fit self-end rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:opacity-50">{pending ? "Saving…" : account ? "Save changes" : "Create counselor"}</button>
    </fieldset>
    <p role="status" className="text-sm">{message}</p>
  </form>;
}

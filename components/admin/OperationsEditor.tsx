"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Pencil, Check, Undo2 } from "lucide-react";
import { areas,getFields,type Area,type Option,type RecordRow } from "@/lib/operations/areas";
import { removeAssignment,setNotificationRead,updateOperation } from "@/actions/operations";

const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-blue-600";
const secondary = "inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50";
const primary = "inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50";
const related: Partial<Record<Area,[string,string]>> = {students:["enrolments","Manage enrolments"],trainers:["assignments","Manage assignments"],jobs:["applications","Track applications"],applications:["placements","Record placements"]};

export default function OperationsEditor({area,rows,options,canEdit}:{area:Area;rows:RecordRow[];options:Record<string,Option[]>;canEdit:boolean}){
 const router=useRouter();
 const config=areas[area], fields=getFields(area), shortcut=related[area];
 const [search,setSearch]=useState(""),[editing,setEditing]=useState<string|null>(null);
 const [values,setValues]=useState<Record<string,string>>({}),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const label=(key:string,value:string|null,source?:string)=>source?options[source]?.find(o=>o.id===value)?.label??value??"—":key==="amount"?new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(Number(value)):value||"—";
 const visible=rows.filter(row=>fields.some(field=>label(field.key,row[field.key],field.source).toLowerCase().includes(search.trim().toLowerCase())));
 function open(row?:RecordRow){
  setEditing(row?.id||"new");setMessage("");
  setValues(Object.fromEntries(fields.map(f=>[f.key,row?.[f.key]??f.options?.[0]??""])));
 }
 async function run(task:()=>Promise<{ok:boolean;message:string}>,close=false){
  setBusy(true);setMessage("");
  try {const result=await task();setMessage(result.message);if(result.ok){if(close)setEditing(null);router.refresh();}}
  catch{setMessage("The request failed. Please retry.");}finally{setBusy(false);}
 }
 const importing=area==="students"&&editing==="new"&&Boolean(values.lead_id);
 return <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-8">
  <header className="rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-100 via-white to-sky-100 p-5 sm:p-7">
   <Link href="/admin" className="text-sm font-semibold text-blue-700">Dashboard</Link>
   <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
    <div><h1 className="text-3xl font-extrabold tracking-tight text-[#071938]">{config.title}</h1><p className="mt-2 text-sm text-slate-600">{config.description}</p></div>
    <div className="flex flex-wrap gap-2">{shortcut&&<Link className={secondary} href={"/admin/operations/"+shortcut[0]}>{shortcut[1]}</Link>}{canEdit&&<button className={primary} disabled={busy} onClick={()=>open()}><Plus size={16}/>New {config.singular}</button>}</div>
   </div>
  </header>
  {message&&<p role="status" className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">{message}</p>}
  {editing&&<form className="rounded-2xl border bg-white p-5" onSubmit={e=>{e.preventDefault();void run(()=>updateOperation(area,editing==="new"?null:editing,values),true);}}>
   <h2 className="mb-4 text-lg font-bold">{editing==="new"?"New ":"Edit "}{config.singular}</h2>
   <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">{fields.filter(f=> !(f.key==="lead_id"&&editing!=="new")&&!(importing&&["name","email","phone"].includes(f.key))).map(f=>{
    const props={className:input,disabled:editing!=="new"&&Boolean(f.fixed),value:values[f.key]||"",required:!f.optional,onChange:(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setValues({...values,[f.key]:e.target.value})};
    return <label className={"space-y-1 text-sm font-medium "+(f.type==="long"?"sm:col-span-2":"")} key={f.key}><span>{f.label}</span>
    {f.options?<select {...props}>{f.options.map(v=><option key={v}>{v}</option>)}</select>:f.source?<select {...props}><option value="">{f.optional?"None":"Select…"}</option>{options[f.source]?.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select>:f.type==="long"?<textarea {...props} rows={4} maxLength={4000}/>:<input {...props} type={f.type==="amount"?"number":f.type||"text"} step={f.type==="amount"?"0.01":undefined} min={f.type==="amount"?"0.01":undefined}/>}</label>;
   })}</fieldset>
   <div className="mt-5 flex flex-wrap gap-2"><button className={primary} disabled={busy}>{busy?"Saving…":"Save record"}</button><button className={secondary} type="button" disabled={busy} onClick={()=>setEditing(null)}>Cancel</button></div>
  </form>}
  <section className="overflow-hidden rounded-2xl border bg-white">
   <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"><h2 className="font-bold">{rows.length} {rows.length===1?"record":"records"}</h2><label className="flex items-center gap-2"><Search size={17} aria-hidden="true"/><input aria-label={"Search "+config.title.toLowerCase()} className={input} placeholder="Search records" value={search} onChange={e=>setSearch(e.target.value)}/></label></div>
   {visible.length===0?<p className="p-6 text-sm text-slate-600">{rows.length?"No matching records.":"No records yet."}</p>:
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr>{fields.filter(f=>f.key!=="lead_id"&&f.type!=="long").map(f=><th className="px-5 py-3" key={f.key}>{f.label}</th>)}{area==="notifications"&&<th className="px-5 py-3">Message</th>}<th className="px-5 py-3">Actions</th></tr></thead><tbody>
    {visible.map(row=><tr key={row.id} className="border-t align-top">{fields.filter(f=>f.key!=="lead_id"&&f.type!=="long").map(f=><td key={f.key} className="min-w-32 px-5 py-4">{label(f.key,row[f.key],f.source)}</td>)}
    {area==="notifications"&&<td className="min-w-56 whitespace-pre-wrap break-words px-5 py-4">{row.body}</td>}
    <td className="px-5 py-3"><div className="flex flex-wrap gap-2">
    {canEdit&&row.status!=="Voided"&&<button className={secondary} disabled={busy} onClick={()=>open(row)}><Pencil size={14}/>Edit</button>}
    {area==="assignments"&&canEdit&&<button className={secondary} disabled={busy} onClick={()=>{if(confirm("Remove this trainer assignment?"))void run(()=>removeAssignment(row.id));}}>Remove</button>}
    {area==="notifications"&&<button className={secondary} disabled={busy} onClick={()=>run(()=>setNotificationRead(row.id,row.seen!=="yes"))}>{row.seen==="yes"?<><Undo2 size={14}/>Mark unread</>:<><Check size={14}/>Mark read</>}</button>}
    </div></td></tr>)}</tbody></table></div>}
  </section>
 </main>;
}

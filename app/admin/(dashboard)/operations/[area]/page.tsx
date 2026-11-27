import {notFound} from "next/navigation";
import Link from "next/link";
import { areas,isArea } from "@/lib/operations/areas";
import { operationsData,operationsUser,reportData } from "@/lib/operations/store";
import ReportMetrics from "@/components/admin/ReportMetrics";
import OperationsEditor from "@/components/admin/OperationsEditor";

export const dynamic = "force-dynamic";

export default async function Operations({params}:{params:Promise<{area:string}>}){
 const {area}=await params;
 if(area!=="reports"&&!isArea(area))notFound();
 const user=await operationsUser(area);
 if(!user)return <main className="p-8"><h1 className="text-2xl font-bold">Access restricted</h1><p className="mt-2">An authorized staff account is required for this workspace.</p><Link className="mt-4 inline-block text-blue-700" href="/admin">Back to dashboard</Link></main>;
 try {
  if(area==="reports"){
   const [data]=await reportData();
   return <ReportMetrics data={data}/>;
  }
  const data=await operationsData(area,user.id);
  return <OperationsEditor key={area} area={area} {...data} canEdit={area!=="notifications"||user.role==="ADMIN"}/>;
 }catch{
  return <main className="p-6"><h1 className="text-2xl font-bold">{area==="reports"?"Reports":areas[area].title}</h1><p role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">Operations data could not load. Check the database connection and confirm the operations migration has been applied.</p></main>;
 }
}

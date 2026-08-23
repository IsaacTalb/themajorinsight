import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { objectKey, presignedUpload, publicUrl } from "@/lib/r2";

export async function POST(request:Request) {
  await requireAdmin(["owner","admin","editor","author"]);
  try { const {filename,mimeType,size}=await request.json(); const key=objectKey(String(filename),String(mimeType),Number(size)); return NextResponse.json({key,publicUrl:publicUrl(key),...presignedUpload(key,String(mimeType))}); }
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Invalid upload."},{status:400})}
}

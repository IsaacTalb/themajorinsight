import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteObject } from "@/lib/r2";
import { repository } from "@/lib/repository";

export async function GET(){await requireAdmin();return NextResponse.json(await repository.media.all())}

export async function POST(request:Request) {
  const {profile}=await requireAdmin(["owner","admin","editor","author"]);
  const body=await request.json();
  if(!body.alt_text?.trim()) return NextResponse.json({error:"Alt text is required before saving media."},{status:400});
  const payload={object_key:body.object_key,filename:body.filename,mime_type:body.mime_type,width:Number(body.width),height:Number(body.height),file_size:Number(body.file_size),r2_url:body.r2_url,alt_text:body.alt_text.trim(),caption:body.caption||null,creator:body.creator||null,original_source_url:body.original_source_url||null,license:body.license||null,attribution:body.attribution||null,associated_post:body.associated_post||null,uploaded_by:profile.id};
  const data=await repository.media.insert(payload); return NextResponse.json(data,{status:201});
}
export async function PATCH(request:Request){await requireAdmin(["owner","admin","editor","author"]);const b=await request.json();if(!b.id||!b.alt_text?.trim())return NextResponse.json({error:"Alt text is required."},{status:400});const fields={alt_text:b.alt_text.trim(),caption:b.caption||null,creator:b.creator||null,original_source_url:b.original_source_url||null,license:b.license||null,attribution:b.attribution||null,associated_post:b.associated_post||null};await repository.media.update("id",String(b.id),fields);return NextResponse.json({ok:true})}
export async function DELETE(request:Request){const {profile}=await requireAdmin(["owner","admin"]);const id=new URL(request.url).searchParams.get("id");if(!id)return NextResponse.json({error:"Missing media id."},{status:400});const asset=await repository.media.find("id",id);if(!asset)return NextResponse.json({error:"Asset not found."},{status:404});if((asset as any).associated_post)return NextResponse.json({error:"Remove this asset from associated articles before deleting it."},{status:409});await deleteObject(String((asset as any).object_key));await repository.media.remove("id",id);await repository.audit.insert({actor_id:profile.id,action:"media.delete",entity_type:"media_asset",entity_id:id});return NextResponse.json({ok:true})}

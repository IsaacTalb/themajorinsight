import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteObject } from "@/lib/r2";

export async function GET(){const {supabase}=await requireAdmin();const {data,error}=await supabase.from("media_assets").select("id,filename,r2_url,alt_text,caption,attribution,width,height,mime_type").order("created_at",{ascending:false}).limit(200);return error?NextResponse.json({error:error.message},{status:400}):NextResponse.json(data)}

export async function POST(request:Request) {
  const {profile,supabase}=await requireAdmin(["owner","admin","editor","author"]);
  const body=await request.json();
  if(!body.alt_text?.trim()) return NextResponse.json({error:"Alt text is required before saving media."},{status:400});
  const payload={object_key:body.object_key,filename:body.filename,mime_type:body.mime_type,width:Number(body.width),height:Number(body.height),file_size:Number(body.file_size),r2_url:body.r2_url,alt_text:body.alt_text.trim(),caption:body.caption||null,creator:body.creator||null,original_source_url:body.original_source_url||null,license:body.license||null,attribution:body.attribution||null,associated_post:body.associated_post||null,uploaded_by:profile.id};
  const {data,error}=await supabase.from("media_assets").insert(payload).select("*").single();
  if(error){await deleteObject(body.object_key).catch(()=>{});return NextResponse.json({error:error.message},{status:400})} return NextResponse.json(data,{status:201});
}
export async function PATCH(request:Request){const {supabase}=await requireAdmin(["owner","admin","editor","author"]);const b=await request.json();if(!b.id||!b.alt_text?.trim())return NextResponse.json({error:"Alt text is required."},{status:400});const fields={alt_text:b.alt_text.trim(),caption:b.caption||null,creator:b.creator||null,original_source_url:b.original_source_url||null,license:b.license||null,attribution:b.attribution||null,associated_post:b.associated_post||null};const {error}=await supabase.from("media_assets").update(fields).eq("id",b.id);return error?NextResponse.json({error:error.message},{status:400}):NextResponse.json({ok:true})}
export async function DELETE(request:Request){const {profile,supabase}=await requireAdmin(["owner","admin"]);const id=new URL(request.url).searchParams.get("id");if(!id)return NextResponse.json({error:"Missing media id."},{status:400});const {data}=await supabase.from("media_assets").select("object_key,associated_post").eq("id",id).maybeSingle();if(!data)return NextResponse.json({error:"Asset not found."},{status:404});const asset=data as any;const {count}=await supabase.from("posts").select("id",{count:"exact",head:true}).eq("featured_image_id",id);if(count||asset.associated_post)return NextResponse.json({error:"Remove this asset from associated articles before deleting it."},{status:409});await deleteObject(asset.object_key);const {error}=await supabase.from("media_assets").delete().eq("id",id);if(error)return NextResponse.json({error:error.message},{status:400});await supabase.from("audit_logs").insert({actor_id:profile.id,action:"media.delete",entity_type:"media_asset",entity_id:id});return NextResponse.json({ok:true})}

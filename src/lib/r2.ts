import "server-only";
import { createHash, createHmac } from "node:crypto";
export { objectKey } from "@/lib/media-validation";

function config() {
  const account=process.env.R2_ACCOUNT_ID, bucket=process.env.R2_BUCKET_NAME, access=process.env.R2_ACCESS_KEY_ID, secret=process.env.R2_SECRET_ACCESS_KEY;
  if(!account||!bucket||!access||!secret) throw new Error("R2 is not configured.");
  return { account,bucket,access,secret, endpoint:`https://${account}.r2.cloudflarestorage.com` };
}
const hash=(x:string|Buffer)=>createHash("sha256").update(x).digest("hex");
const hmac=(key:string|Buffer,x:string)=>createHmac("sha256",key).update(x).digest();
const encode=(x:string)=>encodeURIComponent(x).replace(/[!'()*]/g,c=>`%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const dates=(d=new Date())=>({ day:d.toISOString().slice(0,10).replace(/-/g,""), stamp:d.toISOString().replace(/[:-]|\.\d{3}/g,"") });
function signature(secret:string,day:string,stringToSign:string){const kd=hmac(`AWS4${secret}`,day),kr=hmac(kd,"auto"),ks=hmac(kr,"s3"),k=hmac(ks,"aws4_request");return createHmac("sha256",k).update(stringToSign).digest("hex")}

export function publicUrl(key:string) { const {endpoint,bucket}=config(); return `${(process.env.R2_PUBLIC_BASE_URL || `${endpoint}/${bucket}`).replace(/\/$/,"")}/${key.split("/").map(encode).join("/")}`; }

export function presignedUpload(key:string,mime:string,expires=600) {
  const c=config(), {day,stamp}=dates(), host=`${c.account}.r2.cloudflarestorage.com`, credential=`${c.access}/${day}/auto/s3/aws4_request`, path=`/${encode(c.bucket)}/${key.split("/").map(encode).join("/")}`;
  const params=new URLSearchParams({"X-Amz-Algorithm":"AWS4-HMAC-SHA256","X-Amz-Credential":credential,"X-Amz-Date":stamp,"X-Amz-Expires":String(expires),"X-Amz-SignedHeaders":"content-type;host"}); params.sort();
  const canonical=`PUT\n${path}\n${params}\ncontent-type:${mime}\nhost:${host}\n\ncontent-type;host\nUNSIGNED-PAYLOAD`, scope=`${day}/auto/s3/aws4_request`, sts=`AWS4-HMAC-SHA256\n${stamp}\n${scope}\n${hash(canonical)}`;
  params.set("X-Amz-Signature",signature(c.secret,day,sts));
  return { url:`${c.endpoint}${path}?${params}`, headers:{"Content-Type":mime}, expiresIn:expires };
}

export async function deleteObject(key:string) {
  const c=config(), {day,stamp}=dates(), host=`${c.account}.r2.cloudflarestorage.com`, path=`/${encode(c.bucket)}/${key.split("/").map(encode).join("/")}`, payload=hash("");
  const canonical=`DELETE\n${path}\n\nhost:${host}\nx-amz-content-sha256:${payload}\nx-amz-date:${stamp}\n\nhost;x-amz-content-sha256;x-amz-date\n${payload}`, scope=`${day}/auto/s3/aws4_request`, sts=`AWS4-HMAC-SHA256\n${stamp}\n${scope}\n${hash(canonical)}`;
  const auth=`AWS4-HMAC-SHA256 Credential=${c.access}/${scope}, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=${signature(c.secret,day,sts)}`;
  const response=await fetch(`${c.endpoint}${path}`,{method:"DELETE",headers:{Authorization:auth,"x-amz-content-sha256":payload,"x-amz-date":stamp}});
  if(!response.ok && response.status!==404) throw new Error(`R2 deletion failed (${response.status}).`);
}

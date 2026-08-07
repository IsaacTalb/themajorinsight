const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && serviceRoleKey);

export async function writeToSupabase(table: string, body: Record<string, unknown>, prefer = "return=minimal") {
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase is not configured");

  return fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: prefer
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });
}

export async function callSupabaseRpc<T>(functionName: string, body: Record<string, unknown>) {
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase is not configured");

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`Supabase RPC failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

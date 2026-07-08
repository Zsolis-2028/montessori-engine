import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const ip = getClientIp(req);
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

    const { count: attemptCount, error: rateLimitError } = await supabase
      .from("signup_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", windowStart);

    if (!rateLimitError && (attemptCount ?? 0) >= RATE_LIMIT_MAX_ATTEMPTS) {
      return json({ error: "Too many signup attempts. Please try again later." }, 429);
    }

    await supabase.from("signup_rate_limits").insert({ ip_address: ip });

    const { name, schoolName, email, password } = await req.json();

    if (!name || !schoolName || !email || !password) {
      return json({ error: "Missing required fields." }, 400);
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, school_name: schoolName },
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return json({ error: authError?.message ?? "Signup failed. Please try again." }, 400);
    }

    const userId = authData.user.id;

    const { data: school, error: schoolError } = await supabase
      .from("schools")
      .insert({ name: schoolName })
      .select("id")
      .single();

    if (schoolError || !school) {
      await supabase.auth.admin.deleteUser(userId);
      return json({ error: "School setup failed. Please try again." }, 500);
    }

    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({ user_id: userId, school_id: school.id, role: "teacher" });

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId);
      return json({ error: "Profile setup failed. Please try again." }, 500);
    }

    return json({ success: true });
  } catch (_err) {
    return json({ error: "Unexpected error. Please try again." }, 500);
  }
});

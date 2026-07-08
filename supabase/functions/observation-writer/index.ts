
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";
import { logError } from "../_shared/logger.ts";

const FUNCTION_NAME = "observation-writer";

const RATE_LIMIT_MAX_ATTEMPTS = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
      logError(FUNCTION_NAME, "AuthError", "Missing Authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      logError(FUNCTION_NAME, "AuthError", userError?.message ?? "Invalid token");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

    const { count: attemptCount, error: rateLimitError } = await supabase
      .from("observation_writer_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", windowStart);

    if (!rateLimitError && (attemptCount ?? 0) >= RATE_LIMIT_MAX_ATTEMPTS) {
      logError(FUNCTION_NAME, "RateLimitError", `User ${userId} exceeded observation writer rate limit`);
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("observation_writer_rate_limits").insert({ user_id: userId });

    const { prompt } = await req.json();

    if (!prompt) {
      logError(FUNCTION_NAME, "ValidationError", "Missing prompt");
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      logError(FUNCTION_NAME, "ConfigError", "Missing OPENAI_API_KEY");
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a certified Montessori guide and documentation specialist. Transform raw guide notes into clear, professional Montessori observation records. Use objective, factual language — describe exactly what the child did, said, and chose, without interpretation. Where relevant, reference Montessori concepts such as normalization (deep concentration, repetition, intrinsic satisfaction), sensitive periods (a child's heightened readiness for particular learning), the prepared environment, and the work cycle. Note the material or area of the prepared environment the child engaged with, the nature and duration of concentration, and any indicators of a sensitive period or emerging normalization. Avoid the word 'teacher' — use 'guide' throughout.",
        },
        { role: "user", content: prompt },
      ],
    });

    const observation = completion.choices[0]?.message?.content;

    return new Response(JSON.stringify({ observation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logError(
      FUNCTION_NAME,
      error instanceof Error ? error.name : "UnknownError",
      error instanceof Error ? error.message : String(error)
    );
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
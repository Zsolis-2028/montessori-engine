
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

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
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
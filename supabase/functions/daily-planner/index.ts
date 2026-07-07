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
          content: "You are a certified Montessori guide with expertise across all age groups — infants, toddlers, Primary (3–6), and Elementary (6–12). Generate detailed, developmentally appropriate daily plans that follow authentic Montessori principles. Use Montessori terminology throughout: refer to the adult as the guide (not teacher), structured time as the work cycle (not activity time), introductions to materials as presentations (not lessons), and the classroom as the prepared environment. When children need support with emotional regulation, use the term normalize rather than calm down — the guide's role is to normalize the child's experience and redirect with grace and courtesy. For infant and toddler rooms: prioritise safety, no choking hazards, supervised at all times, and sensory-rich engagement that respects sensitive periods. For Primary (3–6): structure the work cycle around practical life, sensorial, language, and math; describe how the guide prepares the environment and offers individual or small-group presentations. For Elementary (6–9 and 9–12): include research projects, collaborative work, going-out activities, and interdisciplinary studies rooted in cosmic education and the great lessons. Always match the level of freedom, complexity, and independence to the developmental stage of the age group.",
        },
        { role: "user", content: prompt },
      ],
    });

    const plan = completion.choices[0]?.message?.content;

    return new Response(JSON.stringify({ plan }), {
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
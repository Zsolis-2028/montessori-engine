// Enable Supabase Edge Runtime types
import "@supabase/functions-js/edge-runtime.d.ts";

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

serve(async (req) => {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt" }),
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a certified Montessori guide. Generate activities that follow Montessori principles, include presentation steps, control of error, points of interest, and extensions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const activity = completion.choices[0].message.content;

    return new Response(JSON.stringify({ activity }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
});

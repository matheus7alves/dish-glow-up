// supabase/functions/improve-image/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Prompt fixo
const FIXED_PROMPT = `
Pegue a imagem carregada e gere uma nova versão mais apetitosa e profissional, ideal para cardápios digitais de restaurantes (como iFood).
Mantenha exatamente os mesmos ingredientes, produtos e disposição do prato, sem adicionar ou remover elementos.
Melhore apenas a estética: cores mais vivas, iluminação mais natural e atraente, contraste equilibrado, textura realçada, aparência fresca e suculenta, com estilo de fotografia gastronômica profissional que desperte água na boca.
O resultado deve parecer uma foto real, não uma ilustração.
`;

serve(async (req) => {
  try {
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY in environment" }),
        { status: 500 }
      );
    }

    // Recebe o form enviado pelo cliente
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(
        JSON.stringify({ error: "Content-Type must be multipart/form-data" }),
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: "Image file is required" }),
        { status: 400 }
      );
    }

    // Monta o form para a API da OpenAI
    const form = new FormData();
    form.append("image", imageFile, "input.png");
    form.append("prompt", FIXED_PROMPT);
    form.append("model", "gpt-image-1");
    form.append("size", "1024x1024");
    form.append("n", "1");

    // Faz a chamada à OpenAI
    const openAIResponse = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: form,
    });

    if (!openAIResponse.ok) {
      const err = await openAIResponse.json();
      console.error("OpenAI API error:", err);
      return new Response(
        JSON.stringify({ error: "OpenAI API error", details: err }),
        { status: 500 }
      );
    }

    const result = await openAIResponse.json();

    // Pega a URL da imagem retornada
    const imageUrl = result.data?.[0]?.url || null;

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error in improve-image function:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
});
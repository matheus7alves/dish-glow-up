// supabase/functions/improve-image/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Prompt otimizado com correção de defeitos visuais
const FIXED_PROMPT = `
Pegue a imagem carregada e gere uma versão aprimorada, mantendo rigorosamente os mesmos ingredientes, cores, formas, tamanhos, posições e proporções do prato original, sem adicionar, remover ou alterar nenhum elemento.
Corrija discretamente pequenos defeitos visuais como manchas, amassados ou irregularidades que possam prejudicar a aparência da comida, deixando-a mais uniforme e atraente, mas ainda natural.
O foco é apenas na estética: realçar texturas, corrigir luz e cor, equilibrar contraste e saturação de forma realista, e dar sensação de frescor e suculência sem artificialidade.
O resultado deve ser praticamente idêntico à foto base, mas com acabamento limpo, aspecto mais apetitoso e estilo de fotografia gastronômica profissional e realista usada em cardápios digitais de restaurantes.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY in environment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Recebe o form enviado pelo cliente
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(
        JSON.stringify({ error: "Content-Type must be multipart/form-data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: "Image file is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
      let details: unknown = null;
      try {
        details = await openAIResponse.json();
      } catch (_) {
        details = await openAIResponse.text();
      }
      console.error("OpenAI API error:", details);
      
      // Fallback: retorna a imagem original em base64 se a IA falhar
      const imageBuffer = await imageFile.arrayBuffer();
      const imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
      
      return new Response(JSON.stringify({
        data: [{
          b64_json: imageBase64
        }]
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await openAIResponse.json();

    // Retorna o JSON completo da OpenAI (inclui data[0].b64_json)
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in improve-image function:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

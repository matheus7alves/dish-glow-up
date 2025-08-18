import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imagePath } = await req.json();
    
    if (!imagePath) {
      throw new Error('imagePath is required');
    }

    console.log('Processing image:', imagePath);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download the original image from Supabase
    const { data: imageData, error: downloadError } = await supabase.storage
      .from('images')
      .download(imagePath);

    if (downloadError || !imageData) {
      console.error('Error downloading image:', downloadError);
      throw new Error('Failed to download image from storage');
    }

    console.log('Image downloaded successfully');

    // Convert blob to base64
    const arrayBuffer = await imageData.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Call OpenAI API for image improvement
    const openAIResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-2', // Note: gpt-image-1 is not available for edits endpoint
        image: base64Image,
        prompt: `Pegue a imagem carregada e gere uma nova versão mais apetitosa e profissional, ideal para cardápios digitais de restaurantes (como iFood). Mantenha exatamente os mesmos ingredientes, produtos e disposição do prato, sem adicionar ou remover elementos. Melhore apenas a estética: cores mais vivas, iluminação mais natural e atraente, contraste equilibrado, textura realçada, aparência fresca e suculenta, com estilo de fotografia gastronômica profissional que desperte água na boca. O resultado deve parecer uma foto real, não uma ilustração.`,
        size: "1024x1024",
        response_format: "b64_json"
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI response received');

    if (!openAIData.data?.[0]?.b64_json) {
      throw new Error('No image returned from OpenAI');
    }

    // Convert base64 back to blob
    const improvedImageBase64 = openAIData.data[0].b64_json;
    const improvedImageBytes = Uint8Array.from(atob(improvedImageBase64), c => c.charCodeAt(0));
    const improvedImageBlob = new Blob([improvedImageBytes], { type: 'image/png' });

    // Generate unique filename for improved image
    const originalFileName = imagePath.split('/').pop()?.split('.')[0] || 'image';
    const improvedFileName = `improved/${originalFileName}_improved_${Date.now()}.png`;

    // Upload improved image to Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(improvedFileName, improvedImageBlob, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading improved image:', uploadError);
      throw new Error('Failed to upload improved image');
    }

    console.log('Improved image uploaded:', improvedFileName);

    // Get public URL for the improved image
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(improvedFileName);

    const improvedImageUrl = publicUrlData.publicUrl;

    return new Response(
      JSON.stringify({ 
        success: true, 
        improvedImageUrl,
        originalPath: imagePath,
        improvedPath: improvedFileName
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in improve-image function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
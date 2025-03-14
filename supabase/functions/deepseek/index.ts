
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

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
    const { prompt, messages, model = "deepseek-chat" } = await req.json();
    
    const apiUrl = "https://api.deepseek.com/v1/chat/completions";
    
    const requestBody = {
      model: model,
      messages: messages || [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };

    // Log additional info for action challenges to help with debugging
    if (messages && messages.some(m => 
      m.content && typeof m.content === 'string' && 
      m.content.includes('LGAT-style'))) {
      console.log("Processing Action Challenge request with LGAT parameters");
    }

    console.log("DeepSeek API request - system prompt preview:", 
      messages && messages.length > 0 && messages[0].role === 'system' 
        ? messages[0].content.substring(0, 100) + '...' 
        : 'No system prompt');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("DeepSeek API error response:", errorData);
      return new Response(JSON.stringify({ 
        error: `DeepSeek API error: ${response.status}`,
        details: errorData
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log("DeepSeek API response - preview:", 
      data?.choices?.[0]?.message?.content?.substring(0, 100) + '...');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in deepseek function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

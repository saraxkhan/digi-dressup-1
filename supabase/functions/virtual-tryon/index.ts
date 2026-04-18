import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function cleanBase64(base64String: string): string {
  if (!base64String) return "";
  let cleaned = base64String.trim();
  if (cleaned.includes(",") && cleaned.startsWith("data:")) cleaned = cleaned.split(",")[1];
  cleaned = cleaned.replace(/\s/g, "");
  return cleaned;
}

function getMimeType(dataUrl: string): string {
  const match = dataUrl.match(/^data:(image\/[^;]+);base64,/);
  return match ? match[1] : "image/jpeg";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { personImage, clothingImage, clothingOptions, sizeOptions, measurements } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!personImage || !clothingImage) {
      return new Response(
        JSON.stringify({ error: "Both person and clothing images are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const personMime = getMimeType(personImage);
    const clothingMime = getMimeType(clothingImage);
    const personBase64 = cleanBase64(personImage);
    const clothingBase64 = cleanBase64(clothingImage);

    let prompt = "You are a photorealistic virtual try-on AI. Take the person in the first image and dress them in the clothing from the second image. ";

    if (clothingOptions?.type === "stitched") {
      prompt += `Clothing: stitched ${clothingOptions.clothingItem || "garment"}. `;
    } else {
      prompt += `Fabric: ${clothingOptions?.fabricType || "fabric"}. Create a realistic ${clothingOptions?.intendedOutfit || "outfit"} from this fabric. `;
    }

    prompt += `Size: ${sizeOptions?.size || "M"}, Fit: ${sizeOptions?.fit || "Regular"}. `;

    if (measurements) {
      prompt += `Body measurements — Chest: ${measurements.chest}cm, Waist: ${measurements.waist}cm, Hips: ${measurements.hips}cm, Height: ${measurements.height}cm. Use these for accurate fit. `;
    }

    prompt += "Make the result photorealistic with proper cloth draping, realistic shadows, fabric folds, and lighting matching the person's environment. ";
    prompt += "Keep the person's face, hair, body shape, skin tone, and background EXACTLY the same. Only change the clothing. Output a single clean result image.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${personMime};base64,${personBase64}` } },
            { type: "image_url", image_url: { url: `data:${clothingMime};base64,${clothingBase64}` } },
          ],
        }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI processing failed. Please try again." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const resultImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!resultImageUrl) {
      console.error("No image in AI response:", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "AI did not generate an image. Please try again." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ resultImage: resultImageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("virtual-tryon error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

# DressAI — Ultimate Virtual Try-On

> AI-powered virtual try-on with 360° view, drag-to-compare, style scoring, lookbook, community votes, camera capture, body measurements, color variants, and trending gallery.

## Features Added

| Feature | Component | Description |
|---|---|---|
| 🔄 360° Rotation | `View360.tsx` | Drag to rotate result with perspective warp + auto-spin |
| ◫ Drag-to-Compare | `CompareSlider.tsx` | Draggable before/after split slider |
| 🎨 Color Variants | `ColorVariants.tsx` | 8 color swatches with live CSS filter preview |
| ★ Style Score | `StyleScore.tsx` | AI rates fit + gives styling tips via edge function |
| 📷 Camera Capture | `CameraCapture.tsx` | Live webcam capture with countdown + flip |
| 📐 Body Measurements | `BodyMeasurements.tsx` | Chest/waist/hips/height sliders (cm/in toggle) |
| 📖 Lookbook | `Lookbook.tsx` | Save multiple looks, download all, localStorage |
| 👥 Community Votes | `CommunityFeed.tsx` | Swipe Hot/Not on community try-ons |
| 🔥 Trending Gallery | `TrendingGallery.tsx` | Curated clothing picks, no upload needed |
| 🧠 Smarter Prompt | `virtual-tryon/index.ts` | Measurements passed to AI for better fit |

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Set in Supabase dashboard → Settings → Edge Functions:
```
LOVABLE_API_KEY=your_key_here
```

## Deploy Edge Functions

```bash
supabase functions deploy virtual-tryon
supabase functions deploy style-score
```

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion
- Supabase Edge Functions
- Google Gemini 2.5 Flash Image (via Lovable AI Gateway)

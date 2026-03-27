import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Analyzing() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { base64, mimeType, tone, platforms, fileUrl, fileName } = location.state || {};
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const runAnalysis = async () => {
      if (!apiKey || !base64) {
        // Fallback simulated delay
        setTimeout(() => {
          navigate('/results', { state: location.state });
        }, 4000);
        return;
      }

      const activePlatforms = platforms ? Object.keys(platforms).filter(k => platforms[k]) : ['linkedin', 'instagram'];
      const activeTone = tone || 'Professional';

      // Advanced Gemini Vision Call
      const prompt = `You are a world-class social media manager and master copywriter. I am giving you an image.
Analyze the EXACT visual details (colors, objects, mood, lighting, structure) of this image deeply. 

Based strictly on those actual visual details, generate a substantial, highly engaging, trendy, viral social media post explicitly tailored for each of these platforms: ${activePlatforms.join(', ')}.
The precise tone of the text MUST be exactly: "${activeTone}".

Rules for the generation:
1. Describe SPECIFIC elements from the image organically. If there are gradients, neon lights, people, or text, explicitly weave them into the narrative.
2. The posts must be VERY LONG and DETAILED (at least 3-4 distinct paragraphs). Give the posts breathing room using empty line breaks.
3. NEVER use phrases like "In this photo", "The image shows", or "Attached is". Speak perfectly organically as the original creator of whatever is shown.
4. Include strategic, highly relevant emojis that match the "${activeTone}" tone.
5. Include 4 to 6 trending, niche hashtags at the bottom of the post.
6. The structure MUST be platform-native (e.g., LinkedIn uses profound hooks and bullet points; Instagram uses aesthetic vibes and spacing; Twitter is punchy).

Return the final output strictly as JSON.
The JSON object keys MUST precisely match the requested platforms: ${activePlatforms.join(', ')}. The JSON values must be the completed string of text for that platform.`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inlineData: { mimeType: mimeType || "image/jpeg", data: base64 } }
              ]
            }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        });

        if (!response.ok) {
           const errText = await response.text();
           throw new Error(`API request failed: ${response.status} ${errText}`);
        }
        
        const data = await response.json();
        const jsonString = data.candidates[0].content.parts[0].text;
        const aiResults = JSON.parse(jsonString);

        navigate('/results', { state: { ...location.state, aiResults } });

      } catch (e) {
        console.error("AI Generation failed, falling back to mock generator:", e);
        alert("Gemini AI API Failed:\n" + e.message + "\n\nFalling back to simulated data. Please ensure your API key is valid and you have restarted the dev server.");
        // Fallback to local mock generator
        navigate('/results', { state: location.state });
      }
    };

    runAnalysis();
  }, [navigate, location.state]);

  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center relative px-4 md:px-6 overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/10 rounded-full ai-pulse-glow"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
        <div className="relative w-32 h-32 md:w-48 md:h-48 mb-8 md:mb-12 flex items-center justify-center">
          
          <div className="absolute inset-0 rounded-full border border-primary/20 scale-110"></div>
          
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-primary to-primary-container opacity-20 blur-xl"></div>
          
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary via-primary-container to-secondary shadow-[0_0_50px_rgba(204,151,255,0.4)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
            <span className="material-symbols-outlined text-on-primary-fixed text-4xl md:text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>blur_on</span>
            <div className="absolute left-0 right-0 h-1/2 bg-gradient-to-b from-transparent via-white/40 to-transparent scan-line"></div>
          </div>
        </div>
        
        <div className="text-center space-y-2 md:space-y-4">
          <h2 className="font-headline text-2xl md:text-5xl font-extrabold tracking-tight text-on-background">
            AI is analyzing your content<span className="text-primary animate-pulse">...</span>
          </h2>
          <p className="font-body text-on-surface-variant max-w-md mx-auto text-sm md:text-lg">
            Decoding complex patterns and synthesizing unique insights just for you.
          </p>
          {!import.meta.env.VITE_GEMINI_API_KEY && (
            <p className="font-label text-xs text-secondary mt-2 border border-secondary/20 bg-secondary/10 px-3 py-1 rounded-md max-w-sm mx-auto">
              Simulated Mode: Add VITE_GEMINI_API_KEY to .env for real AI vision tracking.
            </p>
          )}
        </div>
      </div>
      
    </main>
  );
}

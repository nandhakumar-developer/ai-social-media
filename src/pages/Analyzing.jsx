import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const STEPS = [
  'Reading your media...',
  'Understanding visual context...',
  'Crafting platform-native copy...',
  'Applying tone & style...',
  'Finalising captions...',
];

export default function Analyzing() {
  const navigate = useNavigate();
  const location = useLocation();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const { base64, mimeType, tone, platforms, lines, fileName } = location.state || {};
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const runAnalysis = async () => {
      const activePlatforms = platforms
        ? Object.keys(platforms).filter(k => platforms[k])
        : ['linkedin', 'instagram'];
      const activeTone = tone || 'Professional';
      const lineCount = lines || 10;

      const platformInstructions = {
        linkedin: 'LinkedIn: Professional hook, 2-3 insight paragraphs, bullet points, CTA, hashtags',
        instagram: 'Instagram: Aesthetic vibe, emojis woven in, line breaks for breathing room, hashtag block at end',
        facebook: 'Facebook: Conversational, story-telling, approachable, CTA, 2-3 paragraphs',
        whatsapp: 'WhatsApp: Short, punchy, uses bold (*word*) formatting, friendly emojis, no hashtags',
        mail: 'Email: Proper Subject line on first line prefixed "Subject:", professional greeting, body paragraphs, sign-off "Best regards, [Name]"',
      };

      const platformGuide = activePlatforms
        .map(p => platformInstructions[p] || p)
        .join('\n');

      const prompt = `You are a world-class social media copywriter and content strategist.

I am giving you a piece of media. Analyze every visual detail — colors, mood, objects, people, lighting, composition, text in the image.

Based on those SPECIFIC visual details, generate a unique, engaging post for EACH of these platforms:
${platformGuide}

Rules:
1. Each post MUST be approximately ${lineCount} lines long (count actual lines, not paragraphs).
2. Tone MUST be exactly: "${activeTone}" throughout.
3. NEVER say "In this image", "The photo shows", or "Attached". Write as the original creator.
4. Include strategic emojis matching the "${activeTone}" tone.
5. Include 4-6 relevant trending hashtags where appropriate for the platform.
6. Make every post feel authentically native to its platform.
7. For email: always start with "Subject: [subject line]" on the very first line.

Return ONLY a valid JSON object. Keys must be exactly: ${activePlatforms.join(', ')}.
Values must be the complete post text as a string. No markdown fences, no extra keys.`;

      if (!apiKey || !base64) {
        // No API key — use mock fallback
        setTimeout(() => {
          navigate('/results', { state: location.state });
        }, 3000);
        return;
      }

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  { inlineData: { mimeType: mimeType || 'image/jpeg', data: base64 } }
                ]
              }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Gemini API error ${res.status}: ${errText}`);
        }

        const data = await res.json();
        const raw = data.candidates[0].content.parts[0].text;
        const aiResults = JSON.parse(raw);
        navigate('/results', { state: { ...location.state, aiResults } });
      } catch (e) {
        console.error('Gemini failed:', e);
        navigate('/results', { state: { ...location.state, geminiError: e.message } });
      }
    };

    runAnalysis();
  }, []);

  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Pulsing orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #cc97ff 0%, transparent 70%)',
            animation: 'pulse-orb 4s ease-in-out infinite'
          }} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">

        {/* Animated icon */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#cc97ff]/20 animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full border border-[#cc97ff]/10" />
          <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #cc97ff 0%, #c284ff 100%)', boxShadow: '0 0 50px rgba(204,151,255,0.4)' }}>
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>blur_on</span>
            {/* Scan line */}
            <div className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent scan-line" />
          </div>
        </div>

        <h2 className="font-['Manrope'] text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
          AI is crafting your captions<span className="text-[#cc97ff] animate-pulse">...</span>
        </h2>
        <p className="text-[#acaaad] text-sm md:text-base max-w-xs">
          Analyzing your media and generating platform-native content tailored just for you.
        </p>

        {/* Animated steps */}
        <div className="mt-8 space-y-2 w-full max-w-xs">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-3 opacity-0"
              style={{ animation: `fadeInStep 0.5s ease forwards ${i * 0.8}s` }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#cc97ff] flex-shrink-0" />
              <span className="text-[#acaaad] text-xs text-left">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInStep {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </main>
  );
}
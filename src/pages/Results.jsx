import { useLocation } from 'react-router-dom';
import { useMemo, useEffect } from 'react';

export default function Results() {
  const location = useLocation();
  const { fileUrl, fileName, platforms, tone, aiResults } = location.state || {};

  const activePlatforms = platforms ? Object.keys(platforms).filter(k => platforms[k]) : ['linkedin', 'instagram'];
  const activeTone = tone || 'Professional';
  
  // High quality fallback generator if VITE_GEMINI_API_KEY is not setup
  const generateMockText = (platform, tone) => {
    const t = tone ? tone.toLowerCase() : "professional";
    
    // --- PROFESSIONAL TONE ---
    if (t === 'professional') {
        if (platform === 'linkedin') return `In today's fast-paced digital landscape, maintaining a competitive edge requires constant innovation. 🚀\n\nI'm thrilled to share a recent project that focuses on geometric synergy and asymmetric design to drive engagement. Data shows that this specific chromatic arrangement increases user retention by over 40%.\n\nKey takeaways:\n🔹 Fluidity over rigid structure\n🔹 Purpose-driven color science\n🔹 Maximized accessibility\n\nI’d love to hear your thoughts on integrating analytical design into modern UI. How is your team approaching this? 👇\n\n#DigitalTransformation #UIUX #Innovation #ThoughtLeadership #DesignThinking`;
        
        if (platform === 'twitter' || platform === 'x') return `A masterclass in modern structural composition and gradient mapping. Proud to share this piece of innovation today. 🚀\n\nWe found that analytical design strategies boost engagement significantly. Thread below on how we achieved this! 👇\n\n#Design #TechInnovation #FutureReady #UX`;
        
        if (platform === 'facebook') return `We are excited to unveil our latest aesthetic milestone. \n\nThis composition reflects our team's unparalleled commitment to innovation, utilizing precise chromatic balance and deep structural integrity to convey a bold vision for the future. We believe that purposeful design changes how users interact with technology.\n\nRead more about our process and let us know your thoughts in the comments! 📈💡`;
        
        if (platform === 'instagram') return `Precision. Innovation. Aesthetics. 📐\n\nOur latest visual exploration merges analytical data-driven design with stunning neon contrasts. We've optimized the visual hierarchy to guide focus naturally, proving that structural integrity and beauty can coexist perfectly.\n\n#ProfessionalDesign #CorporateAesthetics #CleanUI #Inspiration #DesignSystems`;
        
        if (platform === 'youtube') return `In our latest deep-dive, we break down the strategy behind this exact visual framework. \n\nFrom contrast accessibility formulas to dynamic geometric alignment, we cover the exact methods industry leaders use to capture attention. \n\nDon't forget to like, subscribe, and drop a comment below! 🔔📉`;

        if (platform === 'mail') return `Subject: Unveiling Our Latest Design Architecture\n\nTeam,\n\nI am pleased to share our newest structural composition. By leveraging deep charcoal backgrounds paired with high-contrast violet highlights, we've successfully established a cognitive anchor that dramatically improves user focus.\n\nPlease review the attached visual and provide your strategic feedback by EOD tomorrow.\n\nBest regards,\nThe Design Engineering Team`;
    }
    
    // --- CREATIVE TONE ---
    if (t === 'creative') {
        if (platform === 'instagram') return `V I B E S ⚡️\n\nStepping out of the comfort zone and leaning fully into the abstract today. There's something undeniably powerful about the way these neon gradients bleed into the structural void. 🌌🖌️\n\nArt isn't just about what you see; it's about what it makes you feel.\n\nSwipe left to see the intricate details, and drop a 💜 if this color palette speaks to your soul! ✨\n\n—\n#CyberPunkArt #DigitalAesthetics #NeonVibes #CreativeProcess #VisualArts #DesignInspo`;
        
        if (platform === 'linkedin') return `Creativity is just connecting things. 💡\n\nToday, I wanted to showcase an exploratory piece that breaks away from corporate minimalism. By embracing fluid gradients and a surreal color palette, we open up entirely new avenues for emotional connection in digital spaces.\n\nWho says professional can't be intensely creative? Let’s spark a conversation! ✨🚀\n\n#CreativeDirection #Inspiration #OutTheBox #DigitalArt #Networking`;
        
        if (platform === 'facebook') return `Stepping into a completely new dimension today! ✨ \n\nWe've been exploring how light, texture, and geometric forms blend together in a digital space, and honestly, the results are stunning. It feels like reaching into the future. 💜🖌️\n\nWhat does this image make you feel? Tell us in the comments! 👇`;
        
        if (platform === 'twitter' || platform === 'x') return `Just dropped some absolute magic on the timeline ✨\n\nThe way these hues refract is genuinely mesmerizing. Constantly pushing the limits of what digital artistry can be!\n\nDrop a 💜 if you're as obsessed with these vibes as I am. #Art #Aesthetics #Creative`;
        
        if (platform === 'youtube') return `Welcome back to the studio! 🎨✨\n\nToday we are getting super creative and breaking down the exact layer blending modes and color theories used to create this ethereal masterpiece. Grab your tablet and follow along!\n\nSubscribe for more weekly art magic! 🔮🖌️`;

        if (platform === 'mail') return `Subject: ✨ A burst of inspiration for your day!\n\nHey everyone,\n\nWe just wrapped up something incredibly special. We stepped out of our usual boundaries to create a visual that is purely about emotion, flow, and neon surrealism.\n\nTake a look at the attached file. Let it spark some ideas for your next project!\n\nStay creative ✨`;
    }
    
    // --- FUNNY TONE ---
    if (t === 'funny') {
        if (platform === 'linkedin') return `When you finally get the layout right after staring at the screen for 47 hours straight 😂\n\nMy coffee is cold, my eyes are twitching, but at least the gradients look pristine! Who else relates to the late-night design grind? \n\nSending strength to all my fellow pixel-pushers today. ☕️✊\n\n#DesignerLife #CoffeeAddict #TheGrind #Relatable #AgencyLife`;
        
        if (platform === 'instagram') return `Send help, I've been lost in these neon colors for 3 days 😵‍💫😂 \n\nMy brain is literally just violet and magenta right now. But seriously, how absolutely sick does this look? Definitely worth the lack of sleep and the 14 cups of coffee!\n\nTag a creative who needs a nap! 😴👇\n\n#funny #relatable #designstruggles #neon #vibes`;
        
        if (platform === 'twitter' || platform === 'x') return `Me: "I'll just make a quick 5-minute tweak."\nAlso me: *Spends 6 hours adjusting the opacity by 2%* 🤡\n\nEnjoy this masterpiece that consumed my entire weekend sanity! 🎨✨ #designerproblems #art`;
        
        if (platform === 'facebook') return `I am formally apologizing to my laptop fan for what I put it through to render this. 🛫🔥\n\nBut hey, aesthetics require sacrifice, right? Let me know if you guys think it looks cool before I pass out on my keyboard! 😂👇`;
        
        if (platform === 'youtube') return `I Tried To Make Abstract Art But My Computer Almost Exploded... (NOT CLICKBAIT) 😂🔥\n\nWatch me struggle for 20 minutes trying to perfectly balance these colors while slowly losing my sanity. \n\nHit subscribe if you enjoy my suffering! 🔔💀`;

        if (platform === 'mail') return `Subject: I survived the render queue (Barely) 🥵\n\nHey team,\n\nAttached is the final image. I am 90% sure my graphics card was plotting against me, but we made it. \n\nPlease tell me it looks good so my tears weren't in vain. 😂\n\nCheers!`;
    }
    
    // --- INFORMATIVE TONE ---
    if (t === 'informative') {
        if (platform === 'linkedin') return `Did you know that utilizing high-contrast violet gradients increases visual retention by up to 40%? 🧠\n\nThis piece deliberately utilizes structured chromatic depth to guide the viewer's eye along an asymmetric path—known as the 'Z-Pattern' in UX psychology.\n\nFascinating insights into modern composition dynamics! Have you applied psychological design principles in your recent work? 📈💡\n\n#DataDrivenDesign #Insights #Analytics #UXDesign #Psychology`;
        
        if (platform === 'facebook') return `A quick breakdown of this piece: 🔍\n\nThe high-contrast elements are placed exactly on the golden ratio, which forces the eye to travel naturally across the entire canvas. This is why it feels "balanced" even though it's totally abstract! \n\nNext time you see a design you love, look at where the brightest lights are placed. It’s never an accident! 📐💡`;
        
        if (platform === 'instagram') return `The Science of Aesthetics 🧬✨\n\nSwipe to see how we built this. \n1️⃣ The deep charcoal background creates a 'void' effect.\n2️⃣ The neon violet lines act as leading vectors.\n3️⃣ The blur radius simulates atmospheric depth.\n\nEven abstract art relies on heavy math and color theory! \n\nSave this post for your next study session! 📚👇\n\n#ColorTheory #DesignTips #LearnDesign #Educational #Aesthetics`;
        
        if (platform === 'twitter' || platform === 'x') return `Design Fact: The use of deep backgrounds paired with high saturation highlights creates a "cognitive anchor" for users, reducing bounce rates. 📉\n\nArt isn't just subjective; it's a measurable science. 🧪 #UXtips #DesignTheory #WebDesign`;
        
        if (platform === 'youtube') return `The Hidden Math Behind Ethereal Art 🧮✨\n\nIn today's tutorial, we aren't just drawing—we are calculating! Learn how to use the Fibonacci sequence and color wave frequencies to generate mathematically perfect visuals.\n\nGrab your notebooks and hit subscribe! 📝🔔`;

        if (platform === 'mail') return `Subject: Case Study: Chromatic Retention Rates 📊\n\nTeam,\n\nAttached is the latest asset. Note the deliberate placement of the focal light sources. According to our recent A/B testing, this specific layout configuration yields a 14% higher click-through rate compared to flat geometries.\n\nLet's apply these foundational principles to the Q3 campaign.`;
    }

    // Generic fallback for unhandled platforms
    return `Absolutely blown away by the results of this visual exploration. 🚀 Embracing an incredibly ${t} vibe right now! Check it out and drop your thoughts below! #Trending #ContentCreation #Viral`;
  };

  // If aiResults is passed perfectly, use it! Otherwise fallback.
  const getContentForPlatform = (platformKey) => {
    if (aiResults && aiResults[platformKey]) {
      return aiResults[platformKey];
    }
    return generateMockText(platformKey, activeTone);
  };

  const generatedContent = useMemo(() => activePlatforms.map(p => ({
    platform: p,
    displayName: p.charAt(0).toUpperCase() + p.slice(1),
    content: getContentForPlatform(p)
  })), [platforms, activeTone, aiResults]);

  useEffect(() => {
    if (generatedContent.length > 0) {
      const historyItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        tone: activeTone,
        imageName: fileName || "Untitled Media",
        base64: base64 || null,
        mimeType: mimeType || "image/jpeg",
        contentSnippet: generatedContent[0]?.content.substring(0, 90) + "..."
      };

      try {
        const existing = JSON.parse(localStorage.getItem('captivai_history') || '[]');
        const isDuplicate = existing[0] && existing[0].imageName === historyItem.imageName && (Date.now() - parseInt(existing[0].id) < 5000);
        
        if (!isDuplicate) {
          existing.unshift(historyItem);
          localStorage.setItem('captivai_history', JSON.stringify(existing.slice(0, 30)));
        }
      } catch (e) {
        console.error("Could not save to history. Storage might be full.", e);
      }
    }
  }, [generatedContent, activeTone, fileName, base64, mimeType]);


  const handleSpecificCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Text copied to clipboard!");
    } catch (err) {
      alert("Failed to copy text: " + err.message);
    }
  };

  const handleSpecificShare = async (text, fileUrl, fileName) => {
    try {
      if (navigator.share) {
        let filesArray = [];
        if (fileUrl) {
           try {
              const response = await fetch(fileUrl);
              const blob = await response.blob();
              const file = new File([blob], fileName || "shared_image.png", { type: blob.type });
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                 filesArray = [file];
              }
           } catch(e) {
              console.warn("Could not fetch file for sharing", e);
           }
        }
        
        await navigator.share({
          title: 'CaptivAI Insight',
          text: text,
          files: filesArray.length > 0 ? filesArray : undefined
        });
      } else {
        alert("Web Share API is not supported in your browser.");
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        alert("Error sharing: " + err.message);
      }
    }
  };

  return (
    <main className="pb-24 md:pb-32 px-4 md:px-6 max-w-[1200px] mx-auto pt-6 md:pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* Left Side: Media Preview */}
        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="relative group rounded-2xl md:rounded-[1.5rem] overflow-hidden bg-surface-container-low ai-glow transition-transform duration-500 lg:hover:scale-[1.01] aspect-[4/3] flex items-center justify-center bg-black/50 border border-outline-variant/10">
              {fileUrl ? (
                fileName && fileName.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                  <video className="w-full h-full object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl" src={fileUrl} autoPlay loop muted playsInline />
                ) : fileName && fileName.match(/\.(pdf)$/i) ? (
                  <div className="flex flex-col items-center justify-center text-secondary w-full h-full p-8 text-center bg-surface-container-highest/20 rounded-2xl">
                    <span className="material-symbols-outlined text-6xl mb-4">description</span>
                    <span className="font-headline font-bold text-sm truncate w-full px-4">{fileName}</span>
                  </div>
                ) : (
                  <img className="w-full h-full object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100" src={fileUrl} alt={fileName || "Subject"} />
                )
              ) : (
                <div className="text-on-surface-variant p-4 text-center text-sm flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-4xl opacity-50">media_not_supported</span>
                  <span>No media uploaded.<br/>(Simulated Preview)</span>
                </div>
              )}
              
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-surface-container-highest/60 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary text-xs md:text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>image</span>
                <span className="text-[9px] md:text-[10px] font-label font-bold tracking-widest uppercase text-on-surface">Analysis Subject</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Right Side: AI Content Output */}
        <div className="lg:col-span-7 mt-4 lg:mt-0">
          <div className="bg-surface-container-low rounded-2xl md:rounded-[1.5rem] overflow-hidden flex flex-col border border-outline-variant/5">
            
            <div className="px-4 md:px-8 bg-surface-container-high flex justify-between items-center border-b border-outline-variant/10 py-4 md:py-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <div>
                  <h2 className="font-headline text-base md:text-lg font-bold text-on-surface">Luminous Insight Engine</h2>
                  <p className="font-label text-[10px] md:text-xs tracking-wider text-on-surface-variant uppercase mt-1">{activeTone} Synthesis</p>
                </div>
              </div>
              <div className="flex items-center gap-4 hidden md:flex">
                <span className="text-[10px] font-label text-primary font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">{aiResults ? 'AI Generated' : 'v4.2 Analysis'}</span>
              </div>
            </div>

            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
              
              {generatedContent.map(({ platform, displayName, content }, index) => (
                <section key={platform} className={`space-y-4 ${index !== 0 ? 'pt-6 md:pt-8 border-t border-outline-variant/10' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary-fixed">
                        <span className="material-symbols-outlined text-sm">rocket_launch</span>
                    </div>
                    <h4 className="text-sm font-headline text-on-surface tracking-wide font-extrabold">{displayName} Post</h4>
                  </div>
                  
                  <div className="text-on-surface-variant leading-relaxed p-4 md:p-6 bg-surface-container-low rounded-2xl border border-outline-variant/5 shadow-[inset_0_2px_12px_rgba(0,0,0,0.2)]">
                    <p className="whitespace-pre-wrap font-body text-sm md:text-[15px] text-on-surface drop-shadow-sm mb-4 md:mb-6">{content}</p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-4 border-t border-outline-variant/10">
                      <button onClick={() => handleSpecificCopy(content)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface shadow-sm text-xs font-bold font-label uppercase tracking-widest transition-transform active:scale-95 group">
                        <span className="material-symbols-outlined text-sm text-tertiary group-hover:scale-110 transition-transform">content_copy</span>
                        Copy Text
                      </button>
                      <button onClick={() => handleSpecificShare(content, fileUrl, fileName)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-on-primary-fixed shadow-[0_0_12px_rgba(204,151,255,0.2)] text-xs font-bold font-label uppercase tracking-widest transition-transform active:scale-95 group hover:shadow-[0_0_20px_rgba(204,151,255,0.4)]">
                        <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">ios_share</span>
                        Share WaitMedia
                      </button>
                    </div>
                  </div>
                </section>
              ))}

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

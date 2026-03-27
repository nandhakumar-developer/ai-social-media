import { useLocation } from 'react-router-dom';
import { useMemo, useEffect } from 'react';

export default function Results() {
  const location = useLocation();

  // ✅ SAFE STATE HANDLING
  const state = location.state || {};

  const {
    fileUrl,
    fileName,
    platforms,
    tone,
    aiResults,
    base64 = null,
    mimeType = "image/jpeg"
  } = state;

  const activePlatforms = platforms
    ? Object.keys(platforms).filter(k => platforms[k])
    : ['linkedin', 'instagram'];

  const activeTone = tone || 'Professional';

  // --- FALLBACK GENERATOR ---
  const generateMockText = (platform, tone) => {
    const t = tone ? tone.toLowerCase() : "professional";

    if (t === 'professional') {
      if (platform === 'linkedin')
        return `Professional LinkedIn content 🚀\n\nSharing insights and innovation.\n\n#Leadership`;

      if (platform === 'instagram')
        return `Clean. Sharp. Professional. 📐\n\n#Design`;

      if (platform === 'twitter' || platform === 'x')
        return `Professional thoughts in short 🚀 #Tech`;

      if (platform === 'facebook')
        return `Professional update with deeper explanation.`;

      if (platform === 'youtube')
        return `Professional breakdown video description.`;

      if (platform === 'mail')
        return `Subject: Professional Update\n\nTeam,\nHere is the update.\n\nRegards`;
    }

    // fallback
    return `Generated ${t} content 🚀`;
  };

  // ✅ AI OR FALLBACK
  const getContentForPlatform = (platformKey) => {
    if (aiResults && aiResults[platformKey]) {
      return aiResults[platformKey];
    }
    return generateMockText(platformKey, activeTone);
  };

  const generatedContent = useMemo(
    () =>
      activePlatforms.map(p => ({
        platform: p,
        displayName: p.charAt(0).toUpperCase() + p.slice(1),
        content: getContentForPlatform(p)
      })),
    [platforms, activeTone, aiResults]
  );

  // ✅ LOCAL STORAGE FIXED
  useEffect(() => {
    if (generatedContent.length > 0) {
      const historyItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        tone: activeTone,
        imageName: fileName || "Untitled Media",
        base64,
        mimeType,
        contentSnippet:
          generatedContent[0]?.content.substring(0, 90) + "..."
      };

      try {
        const existing = JSON.parse(
          localStorage.getItem('captivai_history') || '[]'
        );

        const isDuplicate =
          existing[0] &&
          existing[0].imageName === historyItem.imageName &&
          Date.now() - parseInt(existing[0].id) < 5000;

        if (!isDuplicate) {
          existing.unshift(historyItem);
          localStorage.setItem(
            'captivai_history',
            JSON.stringify(existing.slice(0, 30))
          );
        }
      } catch (e) {
        console.error("Storage error", e);
      }
    }
  }, [generatedContent, activeTone, fileName, base64, mimeType]);

  // ✅ COPY
  const handleSpecificCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ SHARE
  const handleSpecificShare = async (text, fileUrl, fileName) => {
    try {
      if (navigator.share) {
        let filesArray = [];

        if (fileUrl) {
          try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const file = new File([blob], fileName || "image.png", {
              type: blob.type
            });

            if (navigator.canShare?.({ files: [file] })) {
              filesArray = [file];
            }
          } catch (e) {
            console.warn("File fetch failed", e);
          }
        }

        await navigator.share({
          title: "CaptivAI",
          text,
          files: filesArray.length ? filesArray : undefined
        });
      } else {
        alert("Sharing not supported");
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        alert(err.message);
      }
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <h2>{activeTone} Results</h2>

      {generatedContent.map(({ platform, displayName, content }) => (
        <div key={platform} style={{ marginBottom: "20px" }}>
          <h3>{displayName}</h3>
          <p>{content}</p>

          <button onClick={() => handleSpecificCopy(content)}>
            Copy
          </button>

          <button
            onClick={() =>
              handleSpecificShare(content, fileUrl, fileName)
            }
          >
            Share
          </button>
        </div>
      ))}
    </main>
  );
}
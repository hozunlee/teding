/**
 * Server-side YouTube utility to fetch video metadata without using YouTube Data API.
 */

export interface YouTubeMetadata {
  title: string;
  duration: string; // "m:ss" format
}

/**
 * Fetches video title using oEmbed and duration by parsing the watch page HTML.
 */
export async function getYouTubeMetadata(videoId: string): Promise<YouTubeMetadata> {
  // 1. Fetch Title via oEmbed
  let title = videoId;
  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (oembedRes.ok) {
      const data = await oembedRes.json();
      if (data.title) title = data.title;
    }
  } catch (err) {
    console.error(`[YouTube-Server] Failed to fetch oEmbed for ${videoId}:`, err);
  }

  // 2. Fetch Duration via HTML Parsing
  let duration = "";
  try {
    const htmlRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    if (htmlRes.ok) {
      const html = await htmlRes.text();
      // Look for "lengthSeconds":"123"
      const match = html.match(/"lengthSeconds":"(\d+)"/);
      if (match) {
        const totalSeconds = parseInt(match[1], 10);
        const m = Math.floor(totalSeconds / 60);
        const s = String(totalSeconds % 60).padStart(2, "0");
        duration = `${m}:${s}`;
      }
    }
  } catch (err) {
    console.error(`[YouTube-Server] Failed to parse HTML for ${videoId}:`, err);
  }

  return { title, duration };
}

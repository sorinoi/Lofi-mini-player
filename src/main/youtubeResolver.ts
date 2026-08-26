/**
 * YouTube Resolver Service (Main Process)
 * Resolves various YouTube URL patterns (Watch, Live, Shorts, Embed, youtu.be, and @Channel/live handles)
 * and retrieves metadata via YouTube oEmbed API.
 */

export interface YouTubeResolvedData {
  success: boolean
  videoId?: string
  title?: string
  channel?: string
  thumbnailUrl?: string
  isLive?: boolean
  error?: string
}

/**
 * Extracts 11-character video ID from direct text or standard URL formats
 */
export function extractDirectVideoId(input: string): string | null {
  if (!input || typeof input !== 'string') return null
  const cleaned = input.trim()

  // 1. Direct 11-char Video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
    return cleaned
  }

  // 2. youtube.com/watch?v=... (with any parameter ordering)
  const watchMatch = cleaned.match(/(?:youtube\.com|m\.youtube\.com|music\.youtube\.com)\/watch\?(?:[^&]*&)*v=([a-zA-Z0-9_-]{11})/)
  if (watchMatch) return watchMatch[1]

  // 3. youtu.be/...
  const shortMatch = cleaned.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]

  // 4. youtube.com/live/...
  const liveMatch = cleaned.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/)
  if (liveMatch) return liveMatch[1]

  // 5. youtube.com/shorts/...
  const shortsMatch = cleaned.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/)
  if (shortsMatch) return shortsMatch[1]

  // 6. youtube.com/embed/...
  const embedMatch = cleaned.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch) return embedMatch[1]

  // 7. General fallback regex for ?v= anywhere in URL
  const genericV = cleaned.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (genericV) return genericV[1]

  return null
}

/**
 * Fetches video metadata (title, author, thumbnail) via YouTube oEmbed
 */
export async function fetchYouTubeMetadata(
  videoId: string
): Promise<{ success: boolean; title?: string; channel?: string; thumbnailUrl?: string }> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    const res = await fetch(oembedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (res.ok) {
      const data = (await res.json()) as { title?: string; author_name?: string; thumbnail_url?: string }
      return {
        success: true,
        title: data.title || `YouTube Stream (${videoId})`,
        channel: data.author_name || 'YouTube Channel',
        thumbnailUrl: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      }
    }
  } catch (err) {
    console.warn(`[YouTubeResolver] Metadata fetch error for ${videoId}:`, err)
  }

  // Fallback defaults
  return {
    success: true,
    title: `YouTube Stream (${videoId})`,
    channel: 'YouTube Audio',
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }
}

/**
 * Resolves a live channel handle URL (e.g. https://www.youtube.com/@LofiGirl/live)
 * to its currently broadcasting active Video ID.
 */
async function resolveChannelLiveUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      redirect: 'follow'
    })

    // Check if redirected to standard watch URL
    const finalUrl = res.url || ''
    const directId = extractDirectVideoId(finalUrl)
    if (directId) return directId

    const html = await res.text()

    // Canonical link tag: <link rel="canonical" href="https://www.youtube.com/watch?v=XXXXX">
    const canonicalMatch = html.match(
      /<link\s+rel="canonical"\s+href="https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})"/i
    )
    if (canonicalMatch) return canonicalMatch[1]

    // itemprop videoId
    const itemPropMatch = html.match(/<meta\s+itemprop="videoId"\s+content="([a-zA-Z0-9_-]{11})"/i)
    if (itemPropMatch) return itemPropMatch[1]

    // JSON embedded videoId
    const jsonMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/)
    if (jsonMatch) return jsonMatch[1]
  } catch (err) {
    console.warn(`[YouTubeResolver] Failed to resolve channel live URL (${url}):`, err)
  }
  return null
}

/**
 * Master resolution function: Parses direct links, handles, and extracts metadata.
 */
export async function resolveYouTubeUrl(input: string): Promise<YouTubeResolvedData> {
  if (!input || typeof input !== 'string') {
    return { success: false, error: 'Empty YouTube URL or input' }
  }

  const cleaned = input.trim()

  // Case 1: Direct video ID or standard video URL
  let videoId = extractDirectVideoId(cleaned)

  // Case 2: Channel Live URL format (e.g. @Channel/live, /channel/UC.../live, /c/.../live)
  if (!videoId) {
    const isChannelLiveUrl =
      /youtube\.com\/(?:@[a-zA-Z0-9_.-]+|channel\/[a-zA-Z0-9_-]+|c\/[a-zA-Z0-9_.-]+)\/live/i.test(cleaned) ||
      /^@[a-zA-Z0-9_.-]+$/i.test(cleaned)

    if (isChannelLiveUrl) {
      const fullChannelUrl = cleaned.startsWith('http')
        ? cleaned
        : cleaned.startsWith('@')
          ? `https://www.youtube.com/${cleaned}/live`
          : `https://www.youtube.com/${cleaned}`

      videoId = await resolveChannelLiveUrl(fullChannelUrl)
    }
  }

  if (!videoId) {
    return {
      success: false,
      error: 'Invalid YouTube link format. Please check the URL or Video ID.'
    }
  }

  // Fetch enriched metadata
  const meta = await fetchYouTubeMetadata(videoId)

  return {
    success: true,
    videoId,
    title: meta.title,
    channel: meta.channel,
    thumbnailUrl: meta.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    isLive: cleaned.includes('/live') || cleaned.includes('radio')
  }
}

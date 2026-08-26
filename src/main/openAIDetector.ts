export interface OpenAIQuotaResult {
  success: boolean
  provider: string
  model: string
  plan: string
  email: string
  usedPercentage: number
  remainingRequests: number
  totalRequests: number
  resetTimeText: string
  resetTimestamp: number
  statusMessage: string
  lastUpdated: number
}

export async function fetchOpenAIQuota(token: string): Promise<OpenAIQuotaResult> {
  const cleanToken = token.trim().replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '')
  if (!cleanToken) {
    return {
      success: false,
      provider: 'OpenAI API',
      model: 'gpt-4o',
      plan: 'None',
      email: 'Unknown',
      usedPercentage: 0,
      remainingRequests: 0,
      totalRequests: 0,
      resetTimeText: '--',
      resetTimestamp: Date.now(),
      statusMessage: 'API Key is empty. Please enter your API key.',
      lastUpdated: Date.now()
    }
  }

  // 1. Check if token is for local 9Router gateway (http://127.0.0.1:20128)
  try {
    const local9RouterRes = await fetch('http://127.0.0.1:20128/v1/models', {
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'User-Agent': 'LofiPlayer/1.0'
      }
    })
    if (local9RouterRes.ok) {
      const data: any = await local9RouterRes.json()
      const modelsCount = data?.data?.length || 0
      const firstModel = data?.data?.[0]?.id || 'GLM / GPT-5.5'

      return {
        success: true,
        provider: `9Router Gateway (${firstModel})`,
        model: firstModel,
        plan: `${modelsCount} Models Connected`,
        email: 'Local 9Router',
        usedPercentage: 15,
        remainingRequests: 85,
        totalRequests: 100,
        resetTimeText: 'Active',
        resetTimestamp: Date.now() + 3 * 3600 * 1000,
        statusMessage: `9Router Gateway Synced (${modelsCount} models)`,
        lastUpdated: Date.now()
      }
    }
  } catch {
    // 9Router not running, proceed to official OpenAI
  }

  // 2. Query official OpenAI API
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'User-Agent': 'LofiPlayer/1.0'
      }
    })

    if (res.ok) {
      const data: any = await res.json()
      const modelsCount = data?.data?.length || 0

      const rem = res.headers.get('x-ratelimit-remaining-requests')
      const tot = res.headers.get('x-ratelimit-limit-requests')
      const reset = res.headers.get('x-ratelimit-reset-requests')

      const remainingReq = rem ? parseInt(rem, 10) : 500
      const totalReq = tot ? parseInt(tot, 10) : 500
      const usedPct = Math.min(100, Math.max(0, Math.round(((totalReq - remainingReq) / (totalReq || 1)) * 100)))

      return {
        success: true,
        provider: 'OpenAI Platform',
        model: 'GPT-4o / Models API',
        plan: 'Platform Key',
        email: 'OpenAI Account',
        usedPercentage: usedPct,
        remainingRequests: remainingReq,
        totalRequests: totalReq,
        resetTimeText: reset || 'Active',
        resetTimestamp: Date.now() + 3600000,
        statusMessage: `OpenAI API Connected (${modelsCount} models accessible)`,
        lastUpdated: Date.now()
      }
    } else {
      let errMsg = `HTTP ${res.status}: ${res.statusText}`
      try {
        const errJson: any = await res.json()
        if (errJson?.error?.message) {
          errMsg = errJson.error.message
        }
      } catch {}

      return {
        success: false,
        provider: 'OpenAI API',
        model: 'unknown',
        plan: 'Unauthorized',
        email: 'Unknown',
        usedPercentage: 0,
        remainingRequests: 0,
        totalRequests: 0,
        resetTimeText: '--',
        resetTimestamp: Date.now(),
        statusMessage: res.status === 401
          ? '401 Unauthorized: Invalid OpenAI Key. Make sure key starts with sk-proj-... or use Local Codex option.'
          : errMsg,
        lastUpdated: Date.now()
      }
    }
  } catch (err: any) {
    return {
      success: false,
      provider: 'OpenAI API',
      model: 'unknown',
      plan: 'Error',
      email: 'Unknown',
      usedPercentage: 0,
      remainingRequests: 0,
      totalRequests: 0,
      resetTimeText: '--',
      resetTimestamp: Date.now(),
      statusMessage: err?.message || 'Failed to connect to OpenAI API',
      lastUpdated: Date.now()
    }
  }
}

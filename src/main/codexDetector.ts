import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

export interface LocalCodexQuotaData {
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
  codexHome: string
  isLocalCliDetected: boolean
}

export function detectLocalCodexQuota(): LocalCodexQuotaData {
  const codexHome = join(homedir(), '.codex')
  const authPath = join(codexHome, 'auth.json')
  const configPath = join(codexHome, 'config.toml')
  const sessionPath = join(codexHome, 'session_index.jsonl')

  if (!existsSync(codexHome)) {
    return {
      success: false,
      provider: 'none',
      model: 'unknown',
      plan: 'none',
      email: 'Unknown',
      usedPercentage: 0,
      remainingRequests: 0,
      totalRequests: 80,
      resetTimeText: '--',
      resetTimestamp: Date.now(),
      statusMessage: 'Codex CLI folder (~/.codex) not found',
      lastUpdated: Date.now(),
      codexHome,
      isLocalCliDetected: false
    }
  }

  let plan = 'Plus'
  let email = 'Codex User'
  let model = 'gpt-5.5'
  let provider = '9router'

  // 1. Parse auth.json
  if (existsSync(authPath)) {
    try {
      const rawAuth = JSON.parse(readFileSync(authPath, 'utf8'))
      if (rawAuth.tokens && rawAuth.tokens.id_token) {
        const parts = rawAuth.tokens.id_token.split('.')
        if (parts.length > 1) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
          if (payload.email) email = payload.email
          const authDetails = payload['https://api.openai.com/auth']
          if (authDetails && authDetails.chatgpt_plan_type) {
            plan = authDetails.chatgpt_plan_type
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse ~/.codex/auth.json:', e)
    }
  }

  // 2. Parse config.toml
  if (existsSync(configPath)) {
    try {
      const configStr = readFileSync(configPath, 'utf8')
      const lines = configStr.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('model =') || trimmed.startsWith('model=')) {
          const val = trimmed.split('=')[1]?.trim().replace(/^["']|["']$/g, '')
          if (val) model = val
        }
        if (trimmed.startsWith('model_provider =') || trimmed.startsWith('model_provider=')) {
          const val = trimmed.split('=')[1]?.trim().replace(/^["']|["']$/g, '')
          if (val) provider = val
        }
      }
    } catch (e) {
      console.warn('Failed to parse ~/.codex/config.toml:', e)
    }
  }

  // 3. Parse session_index.jsonl to calculate active 3-hour rolling window requests
  const now = Date.now()
  const windowMs = 3 * 60 * 60 * 1000 // 3 hours in milliseconds
  const windowStart = now - windowMs

  let rollingSessionCount = 0
  let oldestSessionInWindow: number | null = null

  if (existsSync(sessionPath)) {
    try {
      const sessionContent = readFileSync(sessionPath, 'utf8')
      const lines = sessionContent.split('\n')
      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const sessionObj = JSON.parse(line)
          if (sessionObj.updated_at) {
            const time = new Date(sessionObj.updated_at).getTime()
            if (time >= windowStart && time <= now) {
              rollingSessionCount++
              if (!oldestSessionInWindow || time < oldestSessionInWindow) {
                oldestSessionInWindow = time
              }
            }
          }
        } catch {
          // ignore single line json parse error
        }
      }
    } catch (e) {
      console.warn('Failed to parse ~/.codex/session_index.jsonl:', e)
    }
  }

  // Determine limits based on plan
  let totalRequests = 80 // Default ChatGPT Plus 3-hr limit
  if (plan.toLowerCase() === 'pro') {
    totalRequests = 200
  } else if (plan.toLowerCase() === 'team') {
    totalRequests = 100
  } else if (plan.toLowerCase() === 'free') {
    totalRequests = 15
  }

  // If no sessions in the last 3 hours, provide a realistic active idle rate (e.g. 5-10%) or 0%
  const usedRequests = rollingSessionCount
  const remainingRequests = Math.max(0, totalRequests - usedRequests)
  const usedPercentage = Math.min(100, Math.round((usedRequests / totalRequests) * 100))

  let resetTimestamp = now + windowMs
  let resetTimeText = '3h 00m'

  if (oldestSessionInWindow) {
    resetTimestamp = oldestSessionInWindow + windowMs
    const diffMs = Math.max(0, resetTimestamp - now)
    const totalMinutes = Math.floor(diffMs / 60000)
    const hrs = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    resetTimeText = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
  }

  const formattedPlan = plan.charAt(0).toUpperCase() + plan.slice(1)

  return {
    success: true,
    provider: `${provider} (${model})`,
    model,
    plan: formattedPlan,
    email,
    usedPercentage,
    remainingRequests,
    totalRequests,
    resetTimeText,
    resetTimestamp,
    statusMessage: `Local Codex (${formattedPlan}) Synced`,
    lastUpdated: now,
    codexHome,
    isLocalCliDetected: true
  }
}

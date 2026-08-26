import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type QuotaProvider = 'local_codex' | 'demo' | 'codex_subscription' | 'openai_api' | 'copilot' | 'zhipu' | 'custom'

export interface QuotaStateData {
  success: boolean
  provider: string
  model?: string
  plan?: string
  email?: string
  usedPercentage: number
  remainingRequests: number
  totalRequests: number
  remainingTokens?: number
  totalTokens?: number
  resetTimeText: string
  resetTimestamp: number
  statusMessage?: string
  lastUpdated: number
  codexHome?: string
  isLocalCliDetected?: boolean
}

const STORAGE_KEYS = {
  PROVIDER: 'lofi_quota_provider',
  TOKEN: 'lofi_quota_token',
  CUSTOM_URL: 'lofi_quota_custom_url',
  AUTO_REFRESH: 'lofi_quota_auto_refresh'
}

export const useQuotaStore = defineStore('quota', () => {
  const provider = ref<QuotaProvider>('local_codex')
  const token = ref<string>('')
  const customUrl = ref<string>('')
  const autoRefresh = ref<boolean>(true)

  const userEmail = ref<string>('Codex User')
  const userPlan = ref<string>('Plus')
  const activeModel = ref<string>('gpt-5.5')
  const isLocalCliDetected = ref<boolean>(true)

  const usedPercentage = ref<number>(20)
  const remainingRequests = ref<number>(64)
  const totalRequests = ref<number>(80)
  const remainingTokens = ref<number | undefined>(undefined)
  const totalTokens = ref<number | undefined>(undefined)
  const resetTimeText = ref<string>('2h 15m')
  const resetTimestamp = ref<number>(Date.now() + 135 * 60 * 1000)
  const statusMessage = ref<string>('Ready')
  const isConnected = ref<boolean>(true)
  const isLoading = ref<boolean>(false)
  const lastUpdated = ref<number>(Date.now())

  const isModalOpen = ref<boolean>(false)
  let pollIntervalTimer: NodeJS.Timeout | null = null

  // Computed remaining time string formatted dynamically from resetTimestamp
  const formattedCountdown = computed<string>(() => {
    const now = Date.now()
    const diffMs = resetTimestamp.value - now
    if (diffMs <= 0) return 'Refilled'

    const totalSeconds = Math.floor(diffMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  // Color code based on usage quota
  const statusColor = computed<'green' | 'amber' | 'red'>(() => {
    if (usedPercentage.value >= 85) return 'red'
    if (usedPercentage.value >= 60) return 'amber'
    return 'green'
  })

  async function fetchUsage(): Promise<boolean> {
    isLoading.value = true
    try {
      if (provider.value === 'local_codex' && window.api?.detectLocalCodex) {
        const res: QuotaStateData = await window.api.detectLocalCodex()
        if (res) {
          isConnected.value = res.success
          usedPercentage.value = res.usedPercentage
          remainingRequests.value = res.remainingRequests
          totalRequests.value = res.totalRequests
          resetTimeText.value = res.resetTimeText
          resetTimestamp.value = res.resetTimestamp || (Date.now() + 3 * 3600 * 1000)
          statusMessage.value = res.statusMessage || 'Local Codex Synced'
          lastUpdated.value = res.lastUpdated || Date.now()
          if (res.email) userEmail.value = res.email
          if (res.plan) userPlan.value = res.plan
          if (res.model) activeModel.value = res.model
          isLocalCliDetected.value = !!res.isLocalCliDetected
          return res.success
        }
      }

      if (window.api?.fetchQuotaUsage) {
        const res: QuotaStateData = await window.api.fetchQuotaUsage({
          provider: provider.value,
          token: token.value,
          customUrl: customUrl.value
        })

        if (res) {
          isConnected.value = res.success
          usedPercentage.value = res.usedPercentage
          remainingRequests.value = res.remainingRequests
          totalRequests.value = res.totalRequests
          remainingTokens.value = res.remainingTokens
          totalTokens.value = res.totalTokens
          resetTimeText.value = res.resetTimeText
          resetTimestamp.value = res.resetTimestamp || (Date.now() + 3 * 3600 * 1000)
          statusMessage.value = res.statusMessage || (res.success ? 'Synced' : 'Error')
          lastUpdated.value = res.lastUpdated || Date.now()
          if (res.email) userEmail.value = res.email
          if (res.plan) userPlan.value = res.plan
          if (res.model) activeModel.value = res.model
          return res.success
        }
      }
      return false
    } catch (err: any) {
      isConnected.value = false
      statusMessage.value = err?.message || 'Failed to sync quota'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function saveSettings(
    newProvider: QuotaProvider,
    newToken: string,
    newCustomUrl: string,
    newAutoRefresh: boolean
  ): void {
    provider.value = newProvider
    token.value = newToken
    customUrl.value = newCustomUrl
    autoRefresh.value = newAutoRefresh

    try {
      localStorage.setItem(STORAGE_KEYS.PROVIDER, newProvider)
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken)
      localStorage.setItem(STORAGE_KEYS.CUSTOM_URL, newCustomUrl)
      localStorage.setItem(STORAGE_KEYS.AUTO_REFRESH, String(newAutoRefresh))
    } catch {
      // ignore
    }

    restartPolling()
    fetchUsage()
  }

  function restartPolling(): void {
    if (pollIntervalTimer) {
      clearInterval(pollIntervalTimer)
      pollIntervalTimer = null
    }

    if (autoRefresh.value) {
      // Poll every 30 seconds for local file changes or 3 minutes for network
      const interval = provider.value === 'local_codex' ? 30000 : 180000
      pollIntervalTimer = setInterval(() => {
        fetchUsage()
      }, interval)
    }
  }

  function initQuota(): void {
    try {
      const savedProvider = localStorage.getItem(STORAGE_KEYS.PROVIDER) as QuotaProvider | null
      const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const savedCustomUrl = localStorage.getItem(STORAGE_KEYS.CUSTOM_URL)
      const savedAutoRefresh = localStorage.getItem(STORAGE_KEYS.AUTO_REFRESH)

      if (savedProvider) {
        provider.value = savedProvider
      } else {
        provider.value = 'local_codex'
      }
      if (savedToken) token.value = savedToken
      if (savedCustomUrl) customUrl.value = savedCustomUrl
      if (savedAutoRefresh !== null) autoRefresh.value = savedAutoRefresh === 'true'
    } catch {
      // ignore
    }

    fetchUsage()
    restartPolling()
  }

  return {
    provider,
    token,
    customUrl,
    autoRefresh,
    userEmail,
    userPlan,
    activeModel,
    isLocalCliDetected,
    usedPercentage,
    remainingRequests,
    totalRequests,
    remainingTokens,
    totalTokens,
    resetTimeText,
    resetTimestamp,
    statusMessage,
    isConnected,
    isLoading,
    lastUpdated,
    isModalOpen,
    formattedCountdown,
    statusColor,
    fetchUsage,
    saveSettings,
    initQuota
  }
})

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  X,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Key,
  Globe,
  Sliders,
  Sparkles,
  Eye,
  EyeOff,
  Cpu,
  Terminal,
  User,
  ShieldCheck,
  FolderCheck
} from 'lucide-vue-next'
import { useQuotaStore, type QuotaProvider } from '../../stores/quota'

const quotaStore = useQuotaStore()

const localProvider = ref<QuotaProvider>(quotaStore.provider)
const localToken = ref<string>(quotaStore.token)
const localCustomUrl = ref<string>(quotaStore.customUrl)
const localAutoRefresh = ref<boolean>(quotaStore.autoRefresh)
const showToken = ref<boolean>(false)
const isTesting = ref<boolean>(false)
const testFeedback = ref<{ success: boolean; message: string } | null>(null)

watch(
  () => quotaStore.isModalOpen,
  (open) => {
    if (open) {
      localProvider.value = quotaStore.provider
      localToken.value = quotaStore.token
      localCustomUrl.value = quotaStore.customUrl
      localAutoRefresh.value = quotaStore.autoRefresh
      testFeedback.value = null
    }
  }
)

async function handleTestAndSave(): Promise<void> {
  isTesting.value = true
  testFeedback.value = null

  quotaStore.saveSettings(
    localProvider.value,
    localToken.value,
    localCustomUrl.value,
    localAutoRefresh.value
  )

  const success = await quotaStore.fetchUsage()
  isTesting.value = false

  if (success) {
    testFeedback.value = {
      success: true,
      message: localProvider.value === 'local_codex'
        ? `Successfully synced with Local Codex CLI! Plan: ${quotaStore.userPlan} (${quotaStore.userEmail})`
        : 'Successfully connected and synchronized quota status!'
    }
  } else {
    testFeedback.value = {
      success: false,
      message: quotaStore.statusMessage || 'Failed to sync. Please verify local CLI or configuration.'
    }
  }
}

function closeModal(): void {
  quotaStore.isModalOpen = false
}
</script>

<template>
  <div
    v-if="quotaStore.isModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
    @click.self="closeModal"
  >
    <div
      class="w-full max-w-lg bg-lofi-surface/95 border border-lofi-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] backdrop-saturate-150 font-sans"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-lofi-border flex items-center justify-between bg-lofi-card/50">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-lofi-text">Codex CLI & AI Rate Limit Monitor</h3>
            <p class="text-2xs text-lofi-muted">Real-time Subscription & Local Session Tracker</p>
          </div>
        </div>

        <button
          @click="closeModal"
          class="p-1.5 rounded-lg text-lofi-muted hover:text-lofi-text hover:bg-lofi-card transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto space-y-5 flex-1">
        <!-- Live Quota Status Card -->
        <div class="p-4 rounded-2xl bg-lofi-card/80 border border-lofi-border relative overflow-hidden shadow-inner">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xs font-semibold uppercase tracking-wider text-lofi-muted flex items-center gap-1.5">
              <Cpu class="w-3.5 h-3.5 text-lofi-primary" />
              <span>Current Usage Window (3h)</span>
            </span>

            <div class="flex items-center gap-1.5 text-2xs font-mono">
              <span
                :class="[
                  'inline-block w-2 h-2 rounded-full',
                  quotaStore.statusColor === 'green'
                    ? 'bg-emerald-400 animate-pulse'
                    : quotaStore.statusColor === 'amber'
                    ? 'bg-amber-400'
                    : 'bg-rose-500 animate-ping'
                ]"
              ></span>
              <span class="text-lofi-text font-semibold">{{ quotaStore.statusMessage }}</span>
            </div>
          </div>

          <!-- Progress Bar & Big Percentage -->
          <div class="space-y-2">
            <div class="flex items-baseline justify-between">
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-black font-mono tracking-tight text-lofi-text">
                  {{ quotaStore.usedPercentage }}%
                </span>
                <span class="text-2xs text-lofi-muted">Quota Used</span>
              </div>

              <div class="text-right">
                <span class="text-sm font-bold font-mono text-lofi-primary">
                  {{ quotaStore.remainingRequests }} / {{ quotaStore.totalRequests }}
                </span>
                <p class="text-[10px] text-lofi-muted">Requests Remaining</p>
              </div>
            </div>

            <!-- Visual Gradient Progress Bar -->
            <div class="h-2.5 w-full bg-lofi-surface rounded-full overflow-hidden p-0.5 border border-lofi-border/70">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="[
                  quotaStore.statusColor === 'green'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : quotaStore.statusColor === 'amber'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                    : 'bg-gradient-to-r from-rose-500 to-red-600'
                ]"
                :style="{ width: `${quotaStore.usedPercentage}%` }"
              ></div>
            </div>
          </div>

          <!-- Local Codex Account Pill (If Local CLI) -->
          <div
            v-if="quotaStore.provider === 'local_codex'"
            class="mt-3 pt-2.5 border-t border-lofi-border/60 flex items-center justify-between text-2xs"
          >
            <div class="flex items-center gap-1.5 text-lofi-muted">
              <User class="w-3 h-3 text-lofi-primary" />
              <span class="truncate max-w-[170px]">{{ quotaStore.userEmail }}</span>
            </div>
            <div class="flex items-center gap-2 font-mono">
              <span class="px-2 py-0.5 rounded bg-lofi-primary/10 text-lofi-primary font-bold border border-lofi-primary/30">
                {{ quotaStore.userPlan }} Plan
              </span>
              <span class="text-lofi-muted">{{ quotaStore.activeModel }}</span>
            </div>
          </div>

          <!-- Countdown and Reset Time Row -->
          <div class="mt-2.5 pt-2.5 border-t border-lofi-border/60 flex items-center justify-between text-2xs text-lofi-muted font-mono">
            <div class="flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5 text-lofi-primary" />
              <span>Resets in: <strong class="text-lofi-text">{{ quotaStore.formattedCountdown }}</strong></span>
            </div>

            <button
              @click="quotaStore.fetchUsage"
              :disabled="quotaStore.isLoading"
              class="flex items-center gap-1 text-lofi-primary hover:underline disabled:opacity-50"
            >
              <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': quotaStore.isLoading }" />
              <span>Sync Now</span>
            </button>
          </div>
        </div>

        <!-- Connection Feedback Banner -->
        <div
          v-if="testFeedback"
          :class="[
            'p-3 rounded-xl text-xs flex items-center gap-2.5 border transition-all',
            testFeedback.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          ]"
        >
          <CheckCircle2 v-if="testFeedback.success" class="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <AlertCircle v-else class="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{{ testFeedback.message }}</span>
        </div>

        <!-- Settings Form -->
        <div class="space-y-4 pt-1">
          <h4 class="text-xs font-bold text-lofi-text uppercase tracking-wider flex items-center gap-1.5">
            <Sliders class="w-3.5 h-3.5 text-lofi-accent" />
            <span>Connection Source</span>
          </h4>

          <!-- Provider Select -->
          <div class="space-y-1.5">
            <label class="text-2xs font-semibold text-lofi-muted">Data Source / Provider</label>
            <select
              v-model="localProvider"
              class="w-full px-3 py-2 bg-lofi-card border border-lofi-border rounded-xl text-xs text-lofi-text focus:outline-none focus:border-lofi-primary cursor-pointer transition-colors"
            >
              <option value="local_codex">💻 Local Codex CLI (~/.codex on this computer) [Recommended]</option>
              <option value="demo">✨ Demo Live Simulation</option>
              <option value="openai_api">🔑 OpenAI API (Platform Secret Key)</option>
              <option value="copilot">🐙 GitHub Copilot (OAuth Token)</option>
              <option value="zhipu">🇨🇳 GLM / Z.AI (Zhipu AI BigModel Key)</option>
              <option value="custom">🌐 Custom Endpoint URL</option>
            </select>
          </div>

          <!-- Local Codex Info Notice -->
          <div
            v-if="localProvider === 'local_codex'"
            class="p-3 rounded-xl bg-lofi-card/60 border border-lofi-border text-2xs space-y-1.5 text-lofi-muted"
          >
            <div class="flex items-center gap-1.5 text-lofi-primary font-semibold">
              <FolderCheck class="w-3.5 h-3.5" />
              <span>Zero Configuration Needed!</span>
            </div>
            <p>
              โปรแกรมจะอ่านข้อมูลบัญชี, โมเดลที่ใช้งาน (เช่น <strong>{{ quotaStore.activeModel }}</strong>) และประวัติการส่งข้อความจากโฟลเดอร์ <code>~/.codex</code> ในเครื่องของคุณโดยตรง ไม่ต้องก๊อปปี้ Token มาใส่เองครับ
            </p>
          </div>

          <!-- Token Input (For manual API / Copilot / Zhipu) -->
          <div v-else-if="localProvider === 'openai_api' || localProvider === 'copilot' || localProvider === 'zhipu'" class="space-y-1.5">
            <label class="text-2xs font-semibold text-lofi-muted flex items-center justify-between">
              <span>Authentication Token / API Key</span>
              <button
                type="button"
                @click="showToken = !showToken"
                class="text-lofi-primary hover:underline flex items-center gap-1"
              >
                <component :is="showToken ? EyeOff : Eye" class="w-3 h-3" />
                <span>{{ showToken ? 'Hide' : 'Show' }}</span>
              </button>
            </label>

            <div class="relative">
              <Key class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-lofi-muted" />
              <input
                :type="showToken ? 'text' : 'password'"
                v-model="localToken"
                :placeholder="
                  localProvider === 'copilot'
                    ? 'ghp_xxxxxxxxxxxxxxxxxxxx (GitHub PAT / Token)'
                    : localProvider === 'zhipu'
                    ? 'xxxxxxxx.yyyyyyyy (Z.AI / GLM API Key)'
                    : 'sk-proj-xxxxxxxxxxxxxxxx (OpenAI Platform Key)'
                "
                class="w-full pl-9 pr-3 py-2 bg-lofi-card border border-lofi-border rounded-xl text-xs text-lofi-text placeholder-lofi-muted/60 focus:outline-none focus:border-lofi-primary font-mono transition-colors"
              />
            </div>
            <p v-if="localProvider === 'copilot'" class="text-[10px] text-lofi-muted">
              💡 แนะนำ: ใช้ GitHub Personal Access Token (classic) จาก <code>github.com/settings/tokens</code> โดยติ๊กเลือกสิทธิ์ <code>read:user</code> ครับ
            </p>
            <p v-else-if="localProvider === 'zhipu'" class="text-[10px] text-lofi-muted">
              💡 นำ API Key มาจากแพลตฟอร์ม <code>open.bigmodel.cn</code> หรือ <code>z.ai</code> ได้เลยครับ
            </p>
            <p v-else-if="localProvider === 'openai_api'" class="text-[10px] text-lofi-muted">
              💡 สำหรับ OpenAI ให้ใช้ Secret Key (ขึ้นต้นด้วย <code>sk-proj-...</code> หรือ <code>sk-...</code>) จาก <code>platform.openai.com/api-keys</code> หรือหากใช้ 9Router สามารถเลือกตัวเลือก Local Codex ได้เลยครับ
            </p>
          </div>

          <!-- Custom Endpoint URL Input -->
          <div v-if="localProvider === 'custom'" class="space-y-1.5">
            <label class="text-2xs font-semibold text-lofi-muted">Custom Endpoint URL</label>
            <div class="relative">
              <Globe class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-lofi-muted" />
              <input
                type="text"
                v-model="localCustomUrl"
                placeholder="https://your-api.com/v1/quota"
                class="w-full pl-9 pr-3 py-2 bg-lofi-card border border-lofi-border rounded-xl text-xs text-lofi-text placeholder-lofi-muted/60 focus:outline-none focus:border-lofi-primary font-mono transition-colors"
              />
            </div>
          </div>

          <!-- Auto Refresh Checkbox -->
          <label class="flex items-center gap-2.5 text-xs text-lofi-text cursor-pointer pt-1">
            <input
              type="checkbox"
              v-model="localAutoRefresh"
              class="w-4 h-4 rounded bg-lofi-card border-lofi-border accent-lofi-primary cursor-pointer"
            />
            <span class="text-2xs text-lofi-muted">Auto-sync with Codex CLI status automatically in background</span>
          </label>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-lofi-border flex items-center justify-end gap-3 bg-lofi-card/50">
        <button
          @click="closeModal"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-lofi-muted hover:text-lofi-text transition-colors"
        >
          Close
        </button>

        <button
          @click="handleTestAndSave"
          :disabled="isTesting"
          class="flex items-center gap-2 px-5 py-2 rounded-xl bg-lofi-primary text-lofi-bg text-xs font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCw v-if="isTesting" class="w-3.5 h-3.5 animate-spin" />
          <Zap v-else class="w-3.5 h-3.5" />
          <span>Save & Sync</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-2xs {
  font-size: 0.68rem;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>

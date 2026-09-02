<script setup lang="ts">
import { ref } from 'vue'
import { Radio, BarChart3, Disc, Sparkles, Droplets, SlidersHorizontal } from 'lucide-vue-next'
import { useAppStore } from '../../stores/app'
import AnalogVuMeter from './AnalogVuMeter.vue'
import FrequencyBars from './FrequencyBars.vue'
import CircularPulse from './CircularPulse.vue'
import PixelWave from './PixelWave.vue'
import FloatingBubbles from './FloatingBubbles.vue'

const appStore = useAppStore()
const sensitivity = ref<number>(1.2)
const showControls = ref<boolean>(false)

const visualizerModes = [
  { id: 'analog_vu', label: 'Analog VU', icon: Radio },
  { id: 'frequency_bars', label: 'Frequency Bars', icon: BarChart3 },
  { id: 'circular_pulse', label: 'Circular Pulse', icon: Disc },
  { id: 'pixel_wave', label: 'Pixel Wave', icon: Sparkles },
  { id: 'floating_bubbles', label: 'Bubble Flow', icon: Droplets }
] as const
</script>

<template>
  <div class="w-full h-full bg-lofi-surface/80 border border-lofi-border/80 rounded-3xl p-5 md:p-6 backdrop-blur-md shadow-2xl flex flex-col items-center">
    <!-- Visualizer Mode Tabs -->
    <div class="w-full flex items-center justify-between mb-4 pb-3 border-b border-lofi-border/50 flex-shrink-0">
      <div class="flex items-center gap-1.5 bg-lofi-card/80 p-1 rounded-xl border border-lofi-border/60">
        <button
          v-for="mode in visualizerModes"
          :key="mode.id"
          @click="appStore.setVisualizerMode(mode.id)"
          :class="[
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer',
            appStore.visualizerMode === mode.id
              ? 'bg-lofi-primary text-lofi-bg shadow-md'
              : 'text-lofi-muted hover:text-lofi-text hover:bg-lofi-surface/60'
          ]"
        >
          <component :is="mode.icon" class="w-3.5 h-3.5" />
          <span>{{ mode.label }}</span>
        </button>
      </div>

      <!-- Sensitivity Setting Toggle -->
      <button
        @click="showControls = !showControls"
        :class="[
          'p-2 rounded-lg border transition-colors text-xs flex items-center gap-1.5 cursor-pointer',
          showControls
            ? 'bg-lofi-card text-lofi-primary border-lofi-border'
            : 'text-lofi-muted border-transparent hover:text-lofi-text hover:bg-lofi-card/50'
        ]"
        title="Visualizer Sensitivity"
      >
        <SlidersHorizontal class="w-4 h-4" />
      </button>
    </div>

    <!-- Sensitivity Slider Drawer -->
    <div
      v-if="showControls"
      class="w-full mb-4 px-4 py-2.5 bg-lofi-card/50 rounded-xl border border-lofi-border/50 flex items-center justify-between text-xs flex-shrink-0 animate-fadeIn"
    >
      <span class="text-lofi-muted">VU Sensitivity:</span>
      <div class="flex items-center gap-3 w-64">
        <span class="text-lofi-muted">0.5x</span>
        <input
          type="range"
          min="0.5"
          max="2.5"
          step="0.1"
          v-model.number="sensitivity"
          class="flex-1 h-1 bg-lofi-surface rounded-full appearance-none cursor-pointer accent-lofi-primary"
        />
        <span class="text-lofi-primary font-mono w-8 text-right">{{ sensitivity }}x</span>
      </div>
    </div>

    <!-- Dynamic Visualizer Canvas Area -->
    <div class="w-full flex-1 min-h-[300px] bg-lofi-bg/60 rounded-2xl border border-lofi-border/60 flex items-center justify-center overflow-hidden relative">
      <AnalogVuMeter
        v-if="appStore.visualizerMode === 'analog_vu'"
        :sensitivity="sensitivity"
      />
      <FrequencyBars
        v-else-if="appStore.visualizerMode === 'frequency_bars'"
        :sensitivity="sensitivity"
      />
      <CircularPulse
        v-else-if="appStore.visualizerMode === 'circular_pulse'"
        :sensitivity="sensitivity"
      />
      <PixelWave
        v-else-if="appStore.visualizerMode === 'pixel_wave'"
        :sensitivity="sensitivity"
      />
      <FloatingBubbles
        v-else-if="appStore.visualizerMode === 'floating_bubbles'"
        :sensitivity="sensitivity"
      />
    </div>
  </div>
</template>

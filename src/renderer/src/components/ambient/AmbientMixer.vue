<script setup lang="ts">
import { Volume2, VolumeX, Sparkles, Sliders, Power } from 'lucide-vue-next'
import { useAmbientStore, SOUNDSCAPE_PRESETS, type SoundscapePreset } from '../../stores/ambient'

const ambientStore = useAmbientStore()
</script>

<template>
  <div class="w-full h-full flex flex-col p-6 overflow-y-auto max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-lofi-text flex items-center gap-2.5">
          <Sliders class="w-6 h-6 text-lofi-accent" />
          <span>Ambient Sound Mixer</span>
        </h2>
        <p class="text-xs text-lofi-muted mt-0.5">
          Blend multi-channel natural background sounds to create your ideal cozy atmosphere
        </p>
      </div>

      <!-- Quick Master Controls -->
      <div class="flex items-center gap-2">
        <button
          @click="ambientStore.toggleMasterMute"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all',
            ambientStore.isMasterMuted
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-lofi-card text-lofi-text border-lofi-border hover:bg-lofi-surface'
          ]"
        >
          <VolumeX v-if="ambientStore.isMasterMuted" class="w-4 h-4" />
          <Volume2 v-else class="w-4 h-4 text-lofi-accent" />
          <span>{{ ambientStore.isMasterMuted ? 'Muted' : 'Master Mute' }}</span>
        </button>

        <button
          @click="ambientStore.stopAll"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-lofi-card hover:bg-lofi-border text-lofi-muted hover:text-lofi-text text-xs font-semibold border border-lofi-border transition-all"
          title="Turn off all ambient sounds"
        >
          <Power class="w-3.5 h-3.5" />
          <span>Stop All</span>
        </button>
      </div>
    </div>

    <!-- Curated Soundscape Presets -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-3 text-xs font-semibold text-lofi-muted">
        <Sparkles class="w-3.5 h-3.5 text-lofi-primary" />
        <span>Curated Atmosphere Presets:</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        <button
          v-for="preset in SOUNDSCAPE_PRESETS"
          :key="preset.id"
          @click="ambientStore.applyPreset(preset)"
          class="flex flex-col items-center justify-center p-3 rounded-xl bg-lofi-surface/60 hover:bg-lofi-card border border-lofi-border hover:border-lofi-accent/50 transition-all text-center group shadow-sm active:scale-95"
        >
          <span class="text-xl mb-1 group-hover:scale-110 transition-transform">{{ preset.icon }}</span>
          <span class="text-xs font-bold text-lofi-text">{{ preset.name }}</span>
        </button>
      </div>
    </div>

    <!-- Ambient Sound Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
      <div
        v-for="track in ambientStore.soundList"
        :key="track.id"
        :class="[
          'p-4 rounded-2xl border transition-all flex flex-col justify-between backdrop-blur-sm',
          track.isPlaying && !ambientStore.isMasterMuted
            ? 'bg-lofi-surface/90 border-lofi-border shadow-lg ring-1 ring-lofi-accent/30'
            : 'bg-lofi-surface/40 border-lofi-border/60 opacity-70 hover:opacity-100 hover:bg-lofi-surface/60'
        ]"
      >
        <!-- Card Top: Icon, Title, & Power Toggle Button -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all shadow-inner border border-lofi-border',
                track.isPlaying && !ambientStore.isMasterMuted ? 'bg-lofi-card' : 'bg-lofi-surface'
              ]"
            >
              {{ track.icon }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-lofi-text flex items-center gap-2">
                <span>{{ track.name }}</span>
                <!-- Mini Equalizer Bars indicator when playing -->
                <span
                  v-if="track.isPlaying && !ambientStore.isMasterMuted"
                  class="flex items-end gap-0.5 h-3"
                >
                  <span class="w-0.5 bg-lofi-accent animate-pulse h-full"></span>
                  <span class="w-0.5 bg-lofi-primary animate-pulse h-2" style="animation-delay: 150ms"></span>
                  <span class="w-0.5 bg-lofi-green animate-pulse h-3" style="animation-delay: 300ms"></span>
                </span>
              </h4>
              <p class="text-2xs text-lofi-muted mt-0.5 truncate">{{ track.description }}</p>
            </div>
          </div>

          <!-- Switch Toggle Button -->
          <button
            @click="ambientStore.toggleSound(track.id)"
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md',
              track.isPlaying && !ambientStore.isMasterMuted
                ? 'bg-lofi-primary text-lofi-bg'
                : 'bg-lofi-card text-lofi-muted hover:text-lofi-text'
            ]"
          >
            <Power class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Volume Slider Control -->
        <div class="space-y-1.5 pt-2 border-t border-lofi-border/40">
          <div class="flex items-center justify-between text-2xs text-lofi-muted">
            <span>Volume</span>
            <span class="font-mono text-lofi-text">{{ Math.round(track.volume * 100) }}%</span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="track.volume"
            @input="(e) => ambientStore.setVolume(track.id, Number((e.target as HTMLInputElement).value))"
            class="w-full h-1.5 bg-lofi-card rounded-full appearance-none cursor-pointer accent-lofi-accent"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-2xs {
  font-size: 0.68rem;
}
</style>

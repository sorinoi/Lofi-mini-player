/**
 * Procedural Web Audio Ambient Sound Synthesizer
 * Generates organic, continuous background soundscapes (Rain, Fire, Vinyl, Wind, Cafe, Waves, Crickets)
 * and harmonic chime alerts for timers without requiring external audio assets.
 */

export type AmbientSoundType = 'rain' | 'fire' | 'vinyl' | 'wind' | 'cafe' | 'waves' | 'crickets'

interface AmbientChannel {
  gainNode: GainNode
  stopFn: () => void
  isPlaying: boolean
}

class AmbientSynthesizer {
  private ctx: AudioContext | null = null
  private channels: Map<AmbientSoundType, AmbientChannel> = new Map()
  private masterGain: GainNode | null = null

  private isMasterMuted = false
  private masterVolume = 1.0

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 1.0
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public setMasterVolume(vol: number): void {
    const ctx = this.getContext()
    this.masterVolume = Math.max(0, Math.min(1, vol))
    const targetGain = this.isMasterMuted ? 0 : this.masterVolume
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.05)
    }
  }

  public setMasterMute(muted: boolean): void {
    const ctx = this.getContext()
    this.isMasterMuted = muted
    const targetGain = muted ? 0 : this.masterVolume
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.05)
    }
  }

  // Helper to create 5-second loopable noise buffer
  private createNoiseBuffer(type: 'white' | 'pink' | 'brown' = 'white'): AudioBuffer {
    const ctx = this.getContext()
    const bufferSize = ctx.sampleRate * 5
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = buffer.getChannelData(0)

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
        b6 = white * 0.115926
      }
    } else if (type === 'brown') {
      let lastOut = 0.0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        output[i] = (lastOut + 0.02 * white) / 1.02
        lastOut = output[i]
        output[i] *= 3.5 // Gain compensation
      }
    }

    return buffer
  }

  // --- Rain Generator ---
  private createRain(ctx: AudioContext, outGain: GainNode): () => void {
    const noise = ctx.createBufferSource()
    noise.buffer = this.createNoiseBuffer('pink')
    noise.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 900
    filter.Q.value = 0.6

    const dropletFilter = ctx.createBiquadFilter()
    dropletFilter.type = 'bandpass'
    dropletFilter.frequency.value = 1800
    dropletFilter.Q.value = 2.0

    noise.connect(filter)
    filter.connect(outGain)

    noise.start()
    return () => {
      try {
        noise.stop()
        noise.disconnect()
      } catch {}
    }
  }

  // --- Campfire Generator (Rumble + Random Crackles) ---
  private createFire(ctx: AudioContext, outGain: GainNode): () => void {
    const rumble = ctx.createBufferSource()
    rumble.buffer = this.createNoiseBuffer('brown')
    rumble.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 220

    rumble.connect(filter)
    filter.connect(outGain)
    rumble.start()

    // Interval for sporadic ember snaps & pops
    const interval = window.setInterval(() => {
      if (Math.random() > 0.35) {
        const pop = ctx.createBufferSource()
        pop.buffer = this.createNoiseBuffer('white')
        const popFilter = ctx.createBiquadFilter()
        popFilter.type = 'bandpass'
        popFilter.frequency.value = 1200 + Math.random() * 3000
        popFilter.Q.value = 6.0

        const popGain = ctx.createGain()
        const now = ctx.currentTime
        popGain.gain.setValueAtTime(0.3 + Math.random() * 0.4, now)
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04 + Math.random() * 0.06)

        pop.connect(popFilter)
        popFilter.connect(popGain)
        popGain.connect(outGain)

        pop.start(now)
        pop.stop(now + 0.15)
      }
    }, 120)

    return () => {
      clearInterval(interval)
      try {
        rumble.stop()
        rumble.disconnect()
      } catch {}
    }
  }

  // --- Vinyl Crackle Generator ---
  private createVinyl(ctx: AudioContext, outGain: GainNode): () => void {
    const hiss = ctx.createBufferSource()
    hiss.buffer = this.createNoiseBuffer('white')
    hiss.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2500
    filter.Q.value = 1.2

    const hissGain = ctx.createGain()
    hissGain.gain.value = 0.12

    hiss.connect(filter)
    filter.connect(hissGain)
    hissGain.connect(outGain)
    hiss.start()

    const interval = window.setInterval(() => {
      if (Math.random() > 0.4) {
        const crackle = ctx.createBufferSource()
        crackle.buffer = this.createNoiseBuffer('white')
        const cGain = ctx.createGain()
        const now = ctx.currentTime
        cGain.gain.setValueAtTime(0.25 + Math.random() * 0.3, now)
        cGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015)

        crackle.connect(cGain)
        cGain.connect(outGain)
        crackle.start(now)
        crackle.stop(now + 0.03)
      }
    }, 90)

    return () => {
      clearInterval(interval)
      try {
        hiss.stop()
        hiss.disconnect()
      } catch {}
    }
  }

  // --- Forest Wind Generator (LFO Swelling) ---
  private createWind(ctx: AudioContext, outGain: GainNode): () => void {
    const noise = ctx.createBufferSource()
    noise.buffer = this.createNoiseBuffer('pink')
    noise.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 400
    filter.Q.value = 2.5

    // LFO for slow breathing wind gusts
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.12 // 8-second cycle
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 260
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)

    noise.connect(filter)
    filter.connect(outGain)

    noise.start()
    lfo.start()

    return () => {
      try {
        noise.stop()
        lfo.stop()
        noise.disconnect()
      } catch {}
    }
  }

  // --- Coffee Shop Murmur & Mug Clinks ---
  private createCafe(ctx: AudioContext, outGain: GainNode): () => void {
    const murmur = ctx.createBufferSource()
    murmur.buffer = this.createNoiseBuffer('brown')
    murmur.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 450

    murmur.connect(filter)
    filter.connect(outGain)
    murmur.start()

    // Occasional gentle ceramic clinks
    const interval = window.setInterval(() => {
      if (Math.random() > 0.65) {
        const osc = ctx.createOscillator()
        const clinkGain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = 2200 + Math.random() * 800

        const now = ctx.currentTime
        clinkGain.gain.setValueAtTime(0.12, now)
        clinkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)

        osc.connect(clinkGain)
        clinkGain.connect(outGain)
        osc.start(now)
        osc.stop(now + 0.35)
      }
    }, 1800)

    return () => {
      clearInterval(interval)
      try {
        murmur.stop()
        murmur.disconnect()
      } catch {}
    }
  }

  // --- Ocean Waves ---
  private createWaves(ctx: AudioContext, outGain: GainNode): () => void {
    const noise = ctx.createBufferSource()
    noise.buffer = this.createNoiseBuffer('pink')
    noise.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 500

    const swell = ctx.createGain()
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.08 // 12-second wave swell
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.4
    lfo.connect(lfoGain)
    lfoGain.connect(swell.gain)
    swell.gain.value = 0.5

    noise.connect(filter)
    filter.connect(swell)
    swell.connect(outGain)

    noise.start()
    lfo.start()

    return () => {
      try {
        noise.stop()
        lfo.stop()
        noise.disconnect()
      } catch {}
    }
  }

  // --- Night Crickets ---
  private createCrickets(ctx: AudioContext, outGain: GainNode): () => void {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 4600

    const tremolo = ctx.createGain()
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 16 // 16Hz chirp flutter
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.4
    lfo.connect(lfoGain)
    lfoGain.connect(tremolo.gain)
    tremolo.gain.value = 0.5

    osc.connect(tremolo)
    tremolo.connect(outGain)

    osc.start()
    lfo.start()

    return () => {
      try {
        osc.stop()
        lfo.stop()
        osc.disconnect()
      } catch {}
    }
  }

  // --- Public Control Methods ---
  public setChannelState(type: AmbientSoundType, isPlaying: boolean, volume: number): void {
    const ctx = this.getContext()

    let channel = this.channels.get(type)
    if (!channel) {
      const gainNode = ctx.createGain()
      gainNode.gain.value = 0
      gainNode.connect(this.masterGain!)

      channel = {
        gainNode,
        stopFn: () => {},
        isPlaying: false
      }
      this.channels.set(type, channel)
    }

    // Update volume smoothly
    const targetGain = isPlaying ? Math.max(0, Math.min(1, volume)) : 0
    channel.gainNode.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.15)

    if (isPlaying && !channel.isPlaying) {
      // Start generator
      if (type === 'rain') channel.stopFn = this.createRain(ctx, channel.gainNode)
      else if (type === 'fire') channel.stopFn = this.createFire(ctx, channel.gainNode)
      else if (type === 'vinyl') channel.stopFn = this.createVinyl(ctx, channel.gainNode)
      else if (type === 'wind') channel.stopFn = this.createWind(ctx, channel.gainNode)
      else if (type === 'cafe') channel.stopFn = this.createCafe(ctx, channel.gainNode)
      else if (type === 'waves') channel.stopFn = this.createWaves(ctx, channel.gainNode)
      else if (type === 'crickets') channel.stopFn = this.createCrickets(ctx, channel.gainNode)

      channel.isPlaying = true
    } else if (!isPlaying && channel.isPlaying) {
      // Delay stopping sound source slightly to allow smooth fadeout
      channel.isPlaying = false
      setTimeout(() => {
        if (!channel?.isPlaying) {
          channel?.stopFn()
        }
      }, 400)
    }
  }

  /**
   * Plays a cozy harmonic chime notification sound (for Pomodoro / Focus Timer)
   */
  public playChime(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    const freqs = [528, 1056, 1584] // Healing 528Hz Solfeggio bell harmonics
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      const initialGain = 0.25 / (idx + 1)
      gain.gain.setValueAtTime(initialGain, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5 + idx * 0.5)

      osc.connect(gain)
      gain.connect(this.masterGain!)

      osc.start(now)
      osc.stop(now + 3.5)
    })
  }
}

export const ambientSynth = new AmbientSynthesizer()

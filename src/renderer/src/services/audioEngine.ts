/**
 * Web Audio Engine Service
 * Manages AudioContext, AnalyserNode, audio routing, and audio analysis metrics.
 * Supports both local AudioElement analyser and adaptive YouTube audio reactive visualizer.
 */

class AudioEngine {
  private audioCtx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private gainNode: GainNode | null = null
  private sourceNode: MediaElementAudioSourceNode | null = null
  private audioElement: HTMLAudioElement | null = null

  private freqData: Uint8Array<ArrayBuffer> = new Uint8Array(new ArrayBuffer(256))
  private timeData: Uint8Array<ArrayBuffer> = new Uint8Array(new ArrayBuffer(256))
  private isInitialized = false

  // External audio state (YouTube / Live Streams)
  private isExternalActive = false
  private externalVolume = 0.8
  private isExternalMuted = false
  private beatPhase = 0
  private lastTimestamp = performance.now()
  private energyNoise = 0

  public init(audioEl: HTMLAudioElement): void {
    if (this.isInitialized && this.audioElement === audioEl) return

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.audioCtx = new AudioContextClass()
      this.analyser = this.audioCtx.createAnalyser()
      this.analyser.fftSize = 512
      this.analyser.smoothingTimeConstant = 0.82

      this.gainNode = this.audioCtx.createGain()
      this.audioElement = audioEl

      // Connect HTMLAudioElement -> SourceNode -> Analyser -> Gain -> Destination
      this.sourceNode = this.audioCtx.createMediaElementSource(audioEl)
      this.sourceNode.connect(this.analyser)
      this.analyser.connect(this.gainNode)
      this.gainNode.connect(this.audioCtx.destination)

      this.freqData = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount))
      this.timeData = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount))

      this.isInitialized = true
    } catch (e) {
      console.warn('Web Audio Context initialization warning:', e)
    }
  }

  public resume(): void {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }

  public setVolume(val: number): void {
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.audioCtx.currentTime)
    }
  }

  /**
   * Updates external stream active state (for YouTube / live radio streams)
   */
  public setExternalSourceState(active: boolean, volume = 0.8, isMuted = false): void {
    this.isExternalActive = active
    this.externalVolume = Math.max(0, Math.min(1, volume))
    this.isExternalMuted = isMuted
  }

  /**
   * Generates rhythmic, natural lofi spectral data for external audio streams
   */
  private generateSyntheticAudioData(): void {
    const now = performance.now()
    const dt = Math.min(0.1, (now - this.lastTimestamp) / 1000)
    this.lastTimestamp = now

    // Lofi Tempo ~78-82 BPM
    const bpm = 80
    this.beatPhase += dt * (bpm / 60) * 2 * Math.PI

    const effectiveVol = this.isExternalMuted ? 0 : this.externalVolume
    if (!this.isExternalActive || effectiveVol <= 0.001) {
      // Rapid smooth decay to silence
      for (let i = 0; i < this.freqData.length; i++) {
        this.freqData[i] = Math.max(0, Math.floor(this.freqData[i] * 0.85))
        this.timeData[i] = 128
      }
      return
    }

    // Dynamic rhythmic components
    this.energyNoise += (Math.random() * 0.3 - 0.15)
    this.energyNoise = Math.max(-0.25, Math.min(0.25, this.energyNoise * 0.95))

    const kick = Math.pow(Math.max(0, Math.sin(this.beatPhase)), 3.5)
    const snare = Math.pow(Math.max(0, Math.sin(this.beatPhase + Math.PI)), 4.0)
    const groove = 0.5 + 0.35 * Math.sin(this.beatPhase * 2) + 0.15 * Math.cos(this.beatPhase * 4)
    const subBass = 0.7 + 0.3 * Math.sin(this.beatPhase * 0.5)

    const len = this.freqData.length
    for (let i = 0; i < len; i++) {
      const normalizedFreq = i / len

      let bandEnergy = 0
      if (normalizedFreq < 0.12) {
        // Deep Sub & Kick Bass
        bandEnergy = (kick * 0.85 + subBass * 0.6 + groove * 0.2 + this.energyNoise) * (1 - normalizedFreq * 3)
      } else if (normalizedFreq < 0.45) {
        // Warm Mids & Snare/Chords
        const midCenter = 1 - Math.abs(normalizedFreq - 0.25) / 0.25
        bandEnergy = (snare * 0.75 + groove * 0.55 + 0.25 + this.energyNoise) * midCenter
      } else {
        // Highs & Vinyl Air / Hats
        const highFade = Math.max(0, 1 - (normalizedFreq - 0.45) / 0.55)
        const shimmer = 0.4 + 0.3 * Math.sin(this.beatPhase * 8 + i * 0.1)
        bandEnergy = shimmer * highFade * (0.4 + groove * 0.3)
      }

      const randomJitter = (Math.random() * 0.1 - 0.05)
      const val = Math.max(0, Math.min(255, (bandEnergy + randomJitter) * effectiveVol * 255))
      // Smooth interpolation
      this.freqData[i] = Math.round(this.freqData[i] * 0.3 + val * 0.7)

      // Time domain sine wave
      const wave = Math.sin(this.beatPhase * 4 + i * 0.15) * bandEnergy * effectiveVol
      this.timeData[i] = Math.round(128 + wave * 90)
    }
  }

  public getFrequencyData(): Uint8Array<ArrayBuffer> {
    if (this.isExternalActive) {
      this.generateSyntheticAudioData()
      return this.freqData
    }

    if (this.analyser && this.isInitialized) {
      this.analyser.getByteFrequencyData(this.freqData)
    }
    return this.freqData
  }

  public getTimeDomainData(): Uint8Array<ArrayBuffer> {
    if (this.isExternalActive) {
      return this.timeData
    }

    if (this.analyser && this.isInitialized) {
      this.analyser.getByteTimeDomainData(this.timeData)
    }
    return this.timeData
  }

  /**
   * Calculates RMS, Peak, and Bass level for VU meter needle movement (0.0 to 1.0)
   */
  public getAudioLevels(): { rms: number; peak: number; bass: number } {
    const data = this.getFrequencyData()
    if (!data || data.length === 0) return { rms: 0, peak: 0, bass: 0 }

    let sum = 0
    let peak = 0
    let bassSum = 0
    const bassBins = Math.min(16, data.length)

    for (let i = 0; i < data.length; i++) {
      const val = data[i] / 255
      sum += val * val
      if (val > peak) peak = val
      if (i < bassBins) {
        bassSum += val
      }
    }

    const rms = Math.sqrt(sum / data.length)
    const bass = bassBins > 0 ? bassSum / bassBins : 0

    return { rms, peak, bass }
  }
}

export const audioEngine = new AudioEngine()

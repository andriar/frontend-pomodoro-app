export interface SoundConfig {
  enabled: boolean
  volume: number
}

class SoundManager {
  private audioContext: AudioContext | null = null
  private config: SoundConfig = {
    enabled: true,
    volume: 0.5,
  }

  init(config: SoundConfig) {
    this.config = config
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.error('AudioContext not supported:', error)
    }
  }

  playTone(frequency: number = 800, duration: number = 200) {
    if (!this.config.enabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(
      this.config.volume,
      this.audioContext.currentTime + 0.01
    )
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration / 1000
    )

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration / 1000)
  }

  playWorkComplete() {
    // Play a pleasant completion sound
    this.playTone(523.25, 150) // C5
    setTimeout(() => this.playTone(659.25, 150), 150) // E5
    setTimeout(() => this.playTone(783.99, 300), 300) // G5
  }

  playBreakComplete() {
    // Play a different sound for break completion
    this.playTone(440, 200) // A4
    setTimeout(() => this.playTone(554.37, 200), 200) // C#5
  }

  updateConfig(config: Partial<SoundConfig>) {
    this.config = { ...this.config, ...config }
  }
}

export const soundManager = new SoundManager()


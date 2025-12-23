import { onMounted, onUnmounted } from 'vue'
import { usePomodoroStore } from '../stores/pomodoroStore'

export function usePomodoroTimer() {
  const store = usePomodoroStore()
  let intervalId: number | null = null

  const start = () => {
    store.startTimer()
    if (!intervalId) {
      intervalId = window.setInterval(() => {
        store.tick()
      }, 1000)
    }
  }

  const pause = () => {
    store.pauseTimer()
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const stop = () => {
    store.stopTimer()
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const toggle = () => {
    if (store.isRunning) {
      pause()
    } else {
      start()
    }
  }

  const skip = () => {
    store.skipSession()
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onMounted(() => {
    // Start interval if timer is already running
    if (store.isRunning) {
      intervalId = window.setInterval(() => {
        store.tick()
      }, 1000)
    }
  })

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  return {
    start,
    pause,
    stop,
    toggle,
    skip,
  }
}


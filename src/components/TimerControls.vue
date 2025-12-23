<template>
  <div class="flex items-center justify-center gap-4">
    <button
      @click="timer.skip"
      class="px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Skip
    </button>
    <button
      @click="timer.toggle"
      class="px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
      :class="buttonClass"
    >
      {{ store.isRunning ? 'Pause' : 'Start' }}
    </button>
    <button
      @click="timer.stop"
      class="px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="!store.isRunning && !store.isPaused"
    >
      Reset
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePomodoroStore } from '../stores/pomodoroStore'
import { usePomodoroTimer } from '../composables/usePomodoroTimer'

const store = usePomodoroStore()
const timer = usePomodoroTimer()

const buttonClass = computed(() => {
  if (store.isRunning) {
    return 'bg-yellow-500 hover:bg-yellow-600 text-white'
  }
  return store.currentMode === 'work'
    ? 'bg-red-500 hover:bg-red-600 text-white'
    : 'bg-green-500 hover:bg-green-600 text-white'
})
</script>


<template>
  <div class="flex flex-col items-center justify-center">
    <div class="relative w-[320px] h-[320px] flex items-center justify-center">
      <!-- Progress Ring -->
      <ProgressRing
        :progress="store.progress"
        :size="320"
        :stroke-width="10"
        :progress-color="ringColor"
        class="absolute inset-0"
      />
      
      <!-- Timer Content -->
      <div class="relative z-10 flex flex-col items-center justify-center">
        <!-- Mode Label -->
        <div class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">
          {{ modeLabel }}
        </div>
        
        <!-- Time Display -->
        <div class="text-6xl font-bold tabular-nums leading-none mb-3">
          <span class="text-white">{{ formattedMinutes }}</span>
          <span class="mx-1 text-gray-600">:</span>
          <span class="text-white">{{ formattedSeconds }}</span>
        </div>
        
        <!-- Session Counter -->
        <div v-if="store.sessionCount > 0" class="text-xs text-gray-500 font-medium">
          Session {{ store.sessionCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePomodoroStore } from '../stores/pomodoroStore'
import ProgressRing from './ProgressRing.vue'

const store = usePomodoroStore()

const modeLabel = computed(() => {
  switch (store.currentMode) {
    case 'work':
      return 'Focus Time'
    case 'break':
      return 'Short Break'
    case 'longBreak':
      return 'Long Break'
  }
})

const ringColor = computed(() => {
  switch (store.currentMode) {
    case 'work':
      return '#ef4444' // red
    case 'break':
    case 'longBreak':
      return '#10b981' // green
  }
})

const formattedMinutes = computed(() => {
  return String(store.minutes).padStart(2, '0')
})

const formattedSeconds = computed(() => {
  return String(store.seconds).padStart(2, '0')
})
</script>


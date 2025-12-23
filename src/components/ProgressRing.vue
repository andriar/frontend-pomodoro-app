<template>
  <svg
    class="transform -rotate-90"
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
  >
    <circle
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke="bgColor"
      :stroke-width="strokeWidth"
    />
    <circle
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke="progressColor"
      :stroke-width="strokeWidth"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="offset"
      stroke-linecap="round"
      class="transition-all duration-300 ease-linear"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  bgColor?: string
  progressColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 300,
  strokeWidth: 8,
  bgColor: 'rgba(255, 255, 255, 0.1)',
  progressColor: '#ef4444',
})

const center = computed(() => props.size / 2)
const radius = computed(() => props.size / 2 - props.strokeWidth / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value - (props.progress / 100) * circumference.value)
</script>


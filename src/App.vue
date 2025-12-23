<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-bold text-white">🍅 Pomodoro Timer</h1>
        <button
          @click="showSettings = true"
          class="p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          title="Settings"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </header>

      <!-- Main Content -->
      <div class="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
        <!-- Timer Section -->
        <div class="flex flex-col items-center w-full lg:w-auto">
          <div class="mb-8">
            <TimerDisplay />
          </div>
          <div class="mb-8">
            <TimerControls />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="w-full lg:w-auto flex flex-col lg:flex-row gap-6">
          <!-- Tasks -->
          <TaskList />

          <!-- Statistics -->
          <StatisticsPanel />
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <SettingsModal :is-open="showSettings" @close="showSettings = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TimerDisplay from './components/TimerDisplay.vue'
import TimerControls from './components/TimerControls.vue'
import TaskList from './components/TaskList.vue'
import StatisticsPanel from './components/StatisticsPanel.vue'
import SettingsModal from './components/SettingsModal.vue'

const showSettings = ref(false)
</script>

<style scoped>
/* Additional animations can be added here if needed */
</style>

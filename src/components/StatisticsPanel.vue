<template>
  <div class="w-full max-w-md bg-white/5 rounded-2xl p-6 border border-gray-700">
    <h2 class="text-2xl font-bold text-white mb-6">Statistics</h2>

    <div class="space-y-6">
      <!-- Today's Stats -->
      <div>
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Today
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/5 rounded-lg p-4">
            <div class="text-3xl font-bold text-red-500">
              {{ store.statistics.todayPomodoros }}
            </div>
            <div class="text-sm text-gray-400 mt-1">Pomodoros</div>
          </div>
          <div class="bg-white/5 rounded-lg p-4">
            <div class="text-3xl font-bold text-green-500">
              {{ formatTime(store.statistics.todayTime) }}
            </div>
            <div class="text-sm text-gray-400 mt-1">Minutes</div>
          </div>
        </div>
      </div>

      <!-- All Time Stats -->
      <div>
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          All Time
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/5 rounded-lg p-4">
            <div class="text-3xl font-bold text-red-500">
              {{ store.statistics.totalPomodoros }}
            </div>
            <div class="text-sm text-gray-400 mt-1">Pomodoros</div>
          </div>
          <div class="bg-white/5 rounded-lg p-4">
            <div class="text-3xl font-bold text-green-500">
              {{ formatTime(store.statistics.totalTime) }}
            </div>
            <div class="text-sm text-gray-400 mt-1">Minutes</div>
          </div>
        </div>
      </div>

      <!-- Recent Sessions -->
      <div v-if="recentSessions.length > 0">
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Recent Sessions
        </h3>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="session in recentSessions"
            :key="session.id"
            class="flex items-center justify-between p-3 bg-white/5 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-3 h-3 rounded-full"
                :class="
                  session.type === 'work'
                    ? 'bg-red-500'
                    : session.type === 'longBreak'
                    ? 'bg-green-500'
                    : 'bg-blue-500'
                "
              />
              <div>
                <div class="text-white font-medium">
                  {{ session.type === 'work' ? 'Work' : session.type === 'longBreak' ? 'Long Break' : 'Break' }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ formatDate(session.completedAt) }}
                </div>
              </div>
            </div>
            <div class="text-white font-semibold">
              {{ Math.round(session.duration) }}m
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-400 py-8">
        No sessions yet. Start a pomodoro to see your statistics!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePomodoroStore } from '../stores/pomodoroStore'

const store = usePomodoroStore()

const recentSessions = computed(() => {
  return store.statistics.sessions.slice(0, 10)
})

function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  return `${hours}h ${mins}m`
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
</script>


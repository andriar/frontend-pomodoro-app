<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div
        class="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white">Settings</h2>
            <button
              @click="$emit('close')"
              class="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <!-- Timer Durations -->
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Timer Durations</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Work Duration (minutes)
                  </label>
                  <input
                    v-model.number="localSettings.workDuration"
                    type="number"
                    min="1"
                    max="60"
                    step="1"
                    required
                    class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    @blur="validateWorkDuration"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Short Break (minutes)
                  </label>
                  <input
                    v-model.number="localSettings.shortBreakDuration"
                    type="number"
                    min="1"
                    max="30"
                    step="1"
                    required
                    class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    @blur="validateShortBreak"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Long Break (minutes)
                  </label>
                  <input
                    v-model.number="localSettings.longBreakDuration"
                    type="number"
                    min="1"
                    max="60"
                    step="1"
                    required
                    class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    @blur="validateLongBreak"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Intervals until Long Break
                  </label>
                  <input
                    v-model.number="localSettings.intervalsUntilLongBreak"
                    type="number"
                    min="1"
                    max="10"
                    step="1"
                    required
                    class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <!-- Sound Settings -->
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Sound</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-300">Enable Sounds</label>
                  <button
                    @click="localSettings.sound.enabled = !localSettings.sound.enabled"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    :class="
                      localSettings.sound.enabled
                        ? 'bg-red-500'
                        : 'bg-gray-600'
                    "
                  >
                    <span
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      :class="
                        localSettings.sound.enabled
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      "
                    />
                  </button>
                </div>
                <div v-if="localSettings.sound.enabled">
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Volume: {{ Math.round(localSettings.sound.volume * 100) }}%
                  </label>
                  <input
                    v-model.number="localSettings.sound.volume"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4">
              <button
                @click="handleSave"
                class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Save
              </button>
              <button
                @click="$emit('close')"
                class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePomodoroStore, type Settings } from '../stores/pomodoroStore'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const store = usePomodoroStore()

const localSettings = ref<Settings>({
  workDuration: store.settings.workDuration,
  shortBreakDuration: store.settings.shortBreakDuration,
  longBreakDuration: store.settings.longBreakDuration,
  intervalsUntilLongBreak: store.settings.intervalsUntilLongBreak,
  sound: {
    enabled: store.settings.sound.enabled,
    volume: store.settings.sound.volume,
  },
})

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      localSettings.value = {
        workDuration: store.settings.workDuration,
        shortBreakDuration: store.settings.shortBreakDuration,
        longBreakDuration: store.settings.longBreakDuration,
        intervalsUntilLongBreak: store.settings.intervalsUntilLongBreak,
        sound: {
          enabled: store.settings.sound.enabled,
          volume: store.settings.sound.volume,
        },
      }
    }
  }
)

const validateWorkDuration = () => {
  if (!localSettings.value.workDuration || localSettings.value.workDuration < 1) {
    localSettings.value.workDuration = 1
  } else if (localSettings.value.workDuration > 60) {
    localSettings.value.workDuration = 60
  }
}

const validateShortBreak = () => {
  if (!localSettings.value.shortBreakDuration || localSettings.value.shortBreakDuration < 1) {
    localSettings.value.shortBreakDuration = 1
  } else if (localSettings.value.shortBreakDuration > 30) {
    localSettings.value.shortBreakDuration = 30
  }
}

const validateLongBreak = () => {
  if (!localSettings.value.longBreakDuration || localSettings.value.longBreakDuration < 1) {
    localSettings.value.longBreakDuration = 1
  } else if (localSettings.value.longBreakDuration > 60) {
    localSettings.value.longBreakDuration = 60
  }
}

const handleSave = () => {
  // Validate all inputs before saving
  validateWorkDuration()
  validateShortBreak()
  validateLongBreak()
  
  if (localSettings.value.intervalsUntilLongBreak < 1) {
    localSettings.value.intervalsUntilLongBreak = 1
  } else if (localSettings.value.intervalsUntilLongBreak > 10) {
    localSettings.value.intervalsUntilLongBreak = 10
  }
  
  store.updateSettings(localSettings.value)
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
  opacity: 0;
}
</style>


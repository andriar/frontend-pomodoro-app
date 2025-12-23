import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage'
import { soundManager, type SoundConfig } from '../utils/sounds'

export interface Task {
  id: string
  title: string
  completed: boolean
  pomodoros: number
  createdAt: number
}

export interface Session {
  id: string
  type: 'work' | 'break' | 'longBreak'
  duration: number
  completedAt: number
  taskId?: string
}

export interface Settings {
  workDuration: number // in minutes
  shortBreakDuration: number
  longBreakDuration: number
  intervalsUntilLongBreak: number
  sound: SoundConfig
}

export interface Statistics {
  totalPomodoros: number
  totalTime: number // in minutes
  todayPomodoros: number
  todayTime: number
  sessions: Session[]
  lastResetDate: string
}

export const usePomodoroStore = defineStore('pomodoro', () => {
  // Settings (load first to initialize timer correctly)
  const settings = ref<Settings>(storage.get('pomodoro-settings', {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    intervalsUntilLongBreak: 4,
    sound: {
      enabled: true,
      volume: 0.5,
    },
  }))

  // Helper function to get duration (defined early for initialization)
  function getTotalDurationForMode(mode: 'work' | 'break' | 'longBreak'): number {
    switch (mode) {
      case 'work':
        return settings.value.workDuration * 60
      case 'break':
        return settings.value.shortBreakDuration * 60
      case 'longBreak':
        return settings.value.longBreakDuration * 60
    }
  }

  // Timer state
  const currentMode = ref<'work' | 'break' | 'longBreak'>('work')
  const timeRemaining = ref(getTotalDurationForMode('work')) // in seconds
  const isRunning = ref(false)
  const isPaused = ref(false)
  const sessionCount = ref(0) // number of work sessions completed

  // Tasks
  const tasks = ref<Task[]>(storage.get('pomodoro-tasks', []))
  const activeTaskId = ref<string | null>(storage.get('pomodoro-active-task', null))

  // Statistics
  const statistics = ref<Statistics>(storage.get('pomodoro-statistics', {
    totalPomodoros: 0,
    totalTime: 0,
    todayPomodoros: 0,
    todayTime: 0,
    sessions: [],
    lastResetDate: new Date().toDateString(),
  }))

  // Initialize sound manager
  soundManager.init(settings.value.sound)

  // Computed
  const activeTask = computed(() => {
    return activeTaskId.value
      ? tasks.value.find(t => t.id === activeTaskId.value) || null
      : null
  })

  const minutes = computed(() => Math.floor(timeRemaining.value / 60))
  const seconds = computed(() => timeRemaining.value % 60)

  const progress = computed(() => {
    const total = getTotalDurationForMode(currentMode.value)
    return ((total - timeRemaining.value) / total) * 100
  })

  // Helper functions (getTotalDurationForMode already defined above)

  function resetTimer(mode?: 'work' | 'break' | 'longBreak') {
    const targetMode = mode || currentMode.value
    timeRemaining.value = getTotalDurationForMode(targetMode)
    currentMode.value = targetMode
    isRunning.value = false
    isPaused.value = false
  }

  function startTimer() {
    if (isPaused.value) {
      isPaused.value = false
      isRunning.value = true
    } else if (!isRunning.value) {
      isRunning.value = true
    }
  }

  function pauseTimer() {
    isRunning.value = false
    isPaused.value = true
  }

  function stopTimer() {
    isRunning.value = false
    isPaused.value = false
    resetTimer()
  }

  function skipSession() {
    stopTimer()
    if (currentMode.value === 'work') {
      // Move to break
      const shouldBeLongBreak = sessionCount.value > 0 && 
        sessionCount.value % settings.value.intervalsUntilLongBreak === 0
      currentMode.value = shouldBeLongBreak ? 'longBreak' : 'break'
    } else {
      // Move to work
      currentMode.value = 'work'
    }
    resetTimer()
  }

  function tick() {
    if (!isRunning.value) return

    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      completeSession()
    }
  }

  function completeSession() {
    isRunning.value = false
    isPaused.value = false

    const session: Session = {
      id: Date.now().toString(),
      type: currentMode.value,
      duration: getTotalDurationForMode(currentMode.value) / 60,
      completedAt: Date.now(),
      taskId: activeTaskId.value || undefined,
    }

    // Update statistics
    const today = new Date().toDateString()
    if (statistics.value.lastResetDate !== today) {
      statistics.value.todayPomodoros = 0
      statistics.value.todayTime = 0
      statistics.value.lastResetDate = today
    }

    if (currentMode.value === 'work') {
      sessionCount.value++
      statistics.value.totalPomodoros++
      statistics.value.todayPomodoros++
      statistics.value.totalTime += session.duration
      statistics.value.todayTime += session.duration

      // Update active task
      if (activeTaskId.value) {
        const task = tasks.value.find(t => t.id === activeTaskId.value)
        if (task) {
          task.pomodoros++
        }
      }

      soundManager.playWorkComplete()
    } else {
      soundManager.playBreakComplete()
    }

    statistics.value.sessions.unshift(session)
    // Keep only last 100 sessions
    if (statistics.value.sessions.length > 100) {
      statistics.value.sessions = statistics.value.sessions.slice(0, 100)
    }

    // Auto-switch to next mode
    if (currentMode.value === 'work') {
      const shouldBeLongBreak = sessionCount.value % settings.value.intervalsUntilLongBreak === 0
      currentMode.value = shouldBeLongBreak ? 'longBreak' : 'break'
    } else {
      currentMode.value = 'work'
    }

    resetTimer()
    saveStatistics()
  }

  // Task management
  function addTask(title: string) {
    const task: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      pomodoros: 0,
      createdAt: Date.now(),
    }
    tasks.value.push(task)
    saveTasks()
    return task
  }

  function updateTask(id: string, updates: Partial<Task>) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      Object.assign(task, updates)
      saveTasks()
    }
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    if (activeTaskId.value === id) {
      activeTaskId.value = null
    }
    saveTasks()
    saveActiveTask()
  }

  function setActiveTask(id: string | null) {
    activeTaskId.value = id
    saveActiveTask()
  }

  function completeTask(id: string) {
    updateTask(id, { completed: true })
  }

  // Settings
  function updateSettings(newSettings: Partial<Settings>) {
    const workDurationChanged = 
      newSettings.workDuration !== undefined && newSettings.workDuration !== settings.value.workDuration
    const shortBreakChanged = 
      newSettings.shortBreakDuration !== undefined && newSettings.shortBreakDuration !== settings.value.shortBreakDuration
    const longBreakChanged = 
      newSettings.longBreakDuration !== undefined && newSettings.longBreakDuration !== settings.value.longBreakDuration
    
    const durationsChanged = workDurationChanged || shortBreakChanged || longBreakChanged

    settings.value = { ...settings.value, ...newSettings }
    if (newSettings.sound) {
      soundManager.updateConfig(newSettings.sound)
    }
    saveSettings()
    
    // Reset timer if durations changed
    if (durationsChanged) {
      // Stop timer if running or paused
      if (isRunning.value || isPaused.value) {
        isRunning.value = false
        isPaused.value = false
      }
      // Update time remaining based on current mode
      timeRemaining.value = getTotalDurationForMode(currentMode.value)
    }
  }

  // Persistence
  function saveSettings() {
    storage.set('pomodoro-settings', settings.value)
  }

  function saveTasks() {
    storage.set('pomodoro-tasks', tasks.value)
  }

  function saveActiveTask() {
    storage.set('pomodoro-active-task', activeTaskId.value)
  }

  function saveStatistics() {
    storage.set('pomodoro-statistics', statistics.value)
  }

  return {
    // State
    timeRemaining,
    isRunning,
    isPaused,
    currentMode,
    sessionCount,
    settings,
    tasks,
    activeTaskId,
    activeTask,
    statistics,
    // Computed
    minutes,
    seconds,
    progress,
    // Actions
    startTimer,
    pauseTimer,
    stopTimer,
    skipSession,
    tick,
    resetTimer,
    addTask,
    updateTask,
    deleteTask,
    setActiveTask,
    completeTask,
    updateSettings,
  }
})


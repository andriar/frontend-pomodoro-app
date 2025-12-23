<template>
  <div class="w-full max-w-md">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-white">Tasks</h2>
      <button
        @click="showAddTask = true"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
      >
        + Add Task
      </button>
    </div>

    <div v-if="showAddTask" class="mb-4 p-4 bg-white/5 rounded-lg">
      <input
        v-model="newTaskTitle"
        @keyup.enter="handleAddTask"
        @keyup.esc="showAddTask = false"
        placeholder="Enter task title..."
        class="w-full bg-transparent border-b-2 border-red-500 focus:outline-none text-white placeholder-gray-400 pb-2"
        ref="newTaskInputRef"
      />
      <div class="flex gap-2 mt-3">
        <button
          @click="handleAddTask"
          class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
        >
          Add
        </button>
        <button
          @click="showAddTask = false"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>

    <div v-if="store.activeTask" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
      <div class="text-sm text-red-300 font-medium mb-1">Active Task</div>
      <div class="text-white">{{ store.activeTask.title }}</div>
    </div>

    <div class="space-y-2 max-h-96 overflow-y-auto">
      <TaskItem
        v-for="task in incompleteTasks"
        :key="task.id"
        :task="task"
      />
      <div v-if="completedTasks.length > 0" class="pt-4 border-t border-gray-700">
        <div class="text-sm text-gray-400 mb-2">Completed</div>
        <TaskItem
          v-for="task in completedTasks"
          :key="task.id"
          :task="task"
        />
      </div>
      <div v-if="store.tasks.length === 0" class="text-center text-gray-400 py-8">
        No tasks yet. Add one to get started!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { usePomodoroStore } from '../stores/pomodoroStore'
import TaskItem from './TaskItem.vue'

const store = usePomodoroStore()

const showAddTask = ref(false)
const newTaskTitle = ref('')
const newTaskInputRef = ref<HTMLInputElement | null>(null)

const incompleteTasks = computed(() => {
  return store.tasks.filter(t => !t.completed)
})

const completedTasks = computed(() => {
  return store.tasks.filter(t => t.completed)
})

const handleAddTask = () => {
  if (newTaskTitle.value.trim()) {
    store.addTask(newTaskTitle.value.trim())
    newTaskTitle.value = ''
    showAddTask.value = false
  }
}

watch(showAddTask, (value) => {
  if (value) {
    nextTick(() => {
      newTaskInputRef.value?.focus()
    })
  }
})
</script>


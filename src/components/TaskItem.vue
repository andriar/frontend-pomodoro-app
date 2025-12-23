<template>
  <div
    class="group flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
    :class="{ 'opacity-50': task.completed }"
  >
    <input
      type="checkbox"
      :checked="task.completed"
      @change="handleToggle"
      class="w-5 h-5 rounded border-gray-400 text-red-500 focus:ring-2 focus:ring-red-500 cursor-pointer"
    />
    <div class="flex-1 min-w-0">
      <input
        v-if="isEditing"
        v-model="editTitle"
        @blur="handleSave"
        @keyup.enter="handleSave"
        @keyup.esc="handleCancel"
        class="w-full bg-transparent border-b-2 border-red-500 focus:outline-none text-white"
        ref="inputRef"
      />
      <div
        v-else
        @dblclick="startEdit"
        class="text-white cursor-text"
        :class="{ 'line-through': task.completed }"
      >
        {{ task.title }}
      </div>
      <div class="text-sm text-gray-400 mt-1">
        {{ task.pomodoros }} {{ task.pomodoros === 1 ? 'pomodoro' : 'pomodoros' }}
      </div>
    </div>
    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        @click="handleSetActive"
        class="p-2 text-gray-400 hover:text-white transition-colors"
        :class="{ 'text-red-500': isActive }"
        :title="isActive ? 'Active task' : 'Set as active'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <button
        @click="handleDelete"
        class="p-2 text-gray-400 hover:text-red-500 transition-colors"
        title="Delete task"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { usePomodoroStore, type Task } from '../stores/pomodoroStore'

interface Props {
  task: Task
}

const props = defineProps<Props>()
const store = usePomodoroStore()

const isEditing = ref(false)
const editTitle = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const isActive = computed(() => store.activeTaskId === props.task.id)

const startEdit = () => {
  if (props.task.completed) return
  editTitle.value = props.task.title
  isEditing.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleSave = () => {
  if (editTitle.value.trim()) {
    store.updateTask(props.task.id, { title: editTitle.value.trim() })
  }
  isEditing.value = false
}

const handleCancel = () => {
  isEditing.value = false
  editTitle.value = ''
}

const handleToggle = () => {
  store.updateTask(props.task.id, { completed: !props.task.completed })
  if (!props.task.completed) {
    store.completeTask(props.task.id)
  }
}

const handleSetActive = () => {
  if (isActive.value) {
    store.setActiveTask(null)
  } else {
    store.setActiveTask(props.task.id)
  }
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    store.deleteTask(props.task.id)
  }
}
</script>


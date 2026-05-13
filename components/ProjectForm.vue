<script setup lang="ts">
const { createProject } = useApi()

const projectName = ref('')
const loading = ref(false)
const error = ref('')
const showSuccess = ref(false)
const createdApiKey = ref('')
const showModal = ref(false)

const emit = defineEmits<{
  'project-created': []
}>()

const openModal = () => {
  showModal.value = true
  error.value = ''
  createdApiKey.value = ''
  showSuccess.value = false
}

const closeModal = () => {
  showModal.value = false
  projectName.value = ''
  error.value = ''
  createdApiKey.value = ''
  showSuccess.value = false
}

const handleSubmit = async () => {
  error.value = ''
  createdApiKey.value = ''
  showSuccess.value = false

  if (!projectName.value.trim()) {
    error.value = 'Nama project tidak boleh kosong'
    return
  }

  loading.value = true

  try {
    const response = await createProject(projectName.value.trim()) as { success: boolean; data: { api_key: string } }
    if (response.success) {
      createdApiKey.value = response.data.api_key
      showSuccess.value = true
      projectName.value = ''
      emit('project-created')
      setTimeout(() => {
        showSuccess.value = false
        closeModal()
      }, 3000)
    }
  } catch (err: any) {
    error.value = err?.data?.error || err?.message || 'Gagal membuat project'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Trigger Button -->
    <button
      @click="openModal"
      class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Buat Project Baru
    </button>

    <!-- Modal Overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>

          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            <!-- Close button -->
            <button
              @click="closeModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 class="text-xl font-semibold text-gray-800 mb-6">Buat Project Baru</h2>

            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div>
                <label for="project-name" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Project
                </label>
                <input
                  id="project-name"
                  v-model="projectName"
                  type="text"
                  placeholder="Contoh: My Awesome App"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  :disabled="loading"
                  autofocus
                />
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span v-if="loading" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Membuat...
                </span>
                <span v-else>Buat Project</span>
              </button>
            </form>

            <!-- Error -->
            <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>

            <!-- Success -->
            <Transition name="fade">
              <div v-if="showSuccess" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm font-medium text-green-800">Project berhasil dibuat!</p>
                </div>
                <p class="text-xs text-green-700 mb-2">Simpan API Key berikut:</p>
                <code class="block p-2 bg-green-100 rounded-lg text-xs text-green-900 break-all font-mono">
                  {{ createdApiKey }}
                </code>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

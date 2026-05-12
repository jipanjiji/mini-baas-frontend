<script setup lang="ts">
const { createProject } = useApi()

const projectName = ref('')
const loading = ref(false)
const error = ref('')
const createdApiKey = ref('')

const emit = defineEmits<{
  'project-created': []
}>()

const handleSubmit = async () => {
  error.value = ''
  createdApiKey.value = ''

  if (!projectName.value.trim()) {
    error.value = 'Nama project tidak boleh kosong'
    return
  }

  loading.value = true

  try {
    const response = await createProject(projectName.value.trim()) as { success: boolean; data: { api_key: string } }
    if (response.success) {
      createdApiKey.value = response.data.api_key
      projectName.value = ''
      emit('project-created')
    }
  } catch (err: any) {
    error.value = err?.data?.error || err?.message || 'Gagal membuat project'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Buat Project Baru</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="project-name" class="block text-sm font-medium text-gray-700 mb-1">
          Nama Project
        </label>
        <input
          id="project-name"
          v-model="projectName"
          type="text"
          placeholder="Masukkan nama project"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="loading"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ loading ? 'Membuat...' : 'Buat Project' }}
      </button>
    </form>

    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>

    <div v-if="createdApiKey" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
      <p class="text-sm font-medium text-green-800 mb-1">Project berhasil dibuat!</p>
      <p class="text-xs text-green-700 mb-2">Simpan API Key berikut:</p>
      <code class="block p-2 bg-green-100 rounded text-sm text-green-900 break-all font-mono">
        {{ createdApiKey }}
      </code>
    </div>
  </div>
</template>

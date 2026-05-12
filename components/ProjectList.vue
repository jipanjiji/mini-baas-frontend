<script setup lang="ts">
interface Project {
  id: string
  name: string
  api_key: string
  created_at: string
}

defineProps<{
  projects: Project[]
}>()

const copiedKey = ref('')

const copyApiKey = async (apiKey: string) => {
  try {
    await navigator.clipboard.writeText(apiKey)
    copiedKey.value = apiKey
    setTimeout(() => {
      copiedKey.value = ''
    }, 2000)
  } catch {
    // Fallback silently
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Daftar Project</h2>

    <div v-if="projects.length === 0" class="text-center py-8">
      <p class="text-gray-500">Belum ada project</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th class="px-4 py-3">Nama Project</th>
            <th class="px-4 py-3">API Key</th>
            <th class="px-4 py-3">Tanggal Dibuat</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="project in projects"
            :key="project.id"
            class="border-b even:bg-gray-50 odd:bg-white"
          >
            <td class="px-4 py-3 font-medium text-gray-900">
              {{ project.name }}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <code class="text-xs font-mono text-gray-600 break-all">
                  {{ project.api_key }}
                </code>
                <button
                  @click="copyApiKey(project.api_key)"
                  class="flex-shrink-0 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  :title="copiedKey === project.api_key ? 'Tersalin!' : 'Salin API Key'"
                >
                  {{ copiedKey === project.api_key ? '✓' : 'Salin' }}
                </button>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-600 whitespace-nowrap">
              {{ formatDate(project.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

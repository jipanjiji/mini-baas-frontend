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

const revealedKeys = ref<Set<string>>(new Set())
const copiedKey = ref('')
const toastMessage = ref('')

const toggleReveal = (projectId: string) => {
  if (revealedKeys.value.has(projectId)) {
    revealedKeys.value.delete(projectId)
  } else {
    revealedKeys.value.add(projectId)
  }
}

const maskApiKey = (key: string) => {
  return key.substring(0, 8) + '••••••••••••••••' + key.substring(key.length - 8)
}

const copyApiKey = async (apiKey: string) => {
  try {
    await navigator.clipboard.writeText(apiKey)
    copiedKey.value = apiKey
    toastMessage.value = 'API Key berhasil disalin!'
    setTimeout(() => {
      copiedKey.value = ''
      toastMessage.value = ''
    }, 2000)
  } catch {
    toastMessage.value = 'Gagal menyalin API Key'
    setTimeout(() => {
      toastMessage.value = ''
    }, 2000)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div>
    <!-- Toast Notification -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div
          v-if="toastMessage"
          class="fixed bottom-6 right-6 z-50 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-lg"
        >
          {{ toastMessage }}
        </div>
      </Transition>
    </Teleport>

    <div v-if="projects.length === 0" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
      <p class="text-gray-500 font-medium">Belum ada project</p>
      <p class="text-gray-400 text-sm mt-1">Buat project pertama Anda untuk memulai</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 group"
      >
        <!-- Project Name -->
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {{ project.name }}
          </h3>
          <span class="text-xs text-gray-400 whitespace-nowrap ml-2">
            {{ formatDate(project.created_at) }}
          </span>
        </div>

        <!-- API Key -->
        <div class="mb-4">
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">API Key</label>
          <div class="mt-1 flex items-center gap-2">
            <code class="flex-1 text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1.5 rounded-lg truncate">
              {{ revealedKeys.has(project.id) ? project.api_key : maskApiKey(project.api_key) }}
            </code>
            <button
              @click="toggleReveal(project.id)"
              class="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
              :title="revealedKeys.has(project.id) ? 'Sembunyikan' : 'Tampilkan'"
            >
              <svg v-if="!revealedKeys.has(project.id)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
            <button
              @click="copyApiKey(project.api_key)"
              class="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
              title="Salin API Key"
            >
              <svg v-if="copiedKey !== project.api_key" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <svg v-else class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- View Entries Button -->
        <NuxtLink
          :to="`/projects/${project.id}`"
          class="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Lihat Entries
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

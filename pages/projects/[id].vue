<script setup lang="ts">
interface Entry {
  id: string
  project_id: string
  text_data: string
  image_url: string
  created_at: string
}

interface Project {
  id: string
  name: string
  api_key: string
  created_at: string
}

const route = useRoute()
const { getEntries, getProjects } = useApi()

const projectId = route.params.id as string
const project = ref<Project | null>(null)
const entries = ref<Entry[]>([])
const loading = ref(true)
const error = ref('')
const lightboxImage = ref('')

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openLightbox = (imageUrl: string) => {
  lightboxImage.value = imageUrl
}

const closeLightbox = () => {
  lightboxImage.value = ''
}

onMounted(async () => {
  try {
    // Get project info
    const projectsResponse = await getProjects() as { success: boolean; data: Project[] }
    if (projectsResponse.success) {
      project.value = projectsResponse.data.find(p => p.id === projectId) || null
    }

    // Get entries
    const entriesResponse = await getEntries(projectId) as { success: boolean; data: Entry[] }
    if (entriesResponse.success) {
      entries.value = entriesResponse.data
    }
  } catch (err: any) {
    error.value = err?.data?.error || err?.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors mb-6"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali ke Dashboard
      </NuxtLink>

      <!-- Project Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ project?.name || 'Project' }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ entries.length }} entries
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="text-center">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent"></div>
          <p class="mt-3 text-sm text-gray-500">Memuat entries...</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-600 font-medium">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="entries.length === 0" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-gray-500 font-medium">Belum ada entries</p>
        <p class="text-gray-400 text-sm mt-1">Gunakan simulasi pengiriman untuk menambah data</p>
      </div>

      <!-- Entries Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="entry in entries"
          :key="entry.id"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
        >
          <!-- Image -->
          <div
            class="relative h-48 bg-gray-100 cursor-pointer overflow-hidden"
            @click="openLightbox(entry.image_url)"
          >
            <img
              :src="entry.image_url"
              :alt="entry.text_data"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
              <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <p class="text-sm text-gray-800 font-medium line-clamp-2">{{ entry.text_data }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ formatDate(entry.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="lightboxImage"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          @click="closeLightbox"
        >
          <button
            class="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            @click="closeLightbox"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            :src="lightboxImage"
            alt="Full size"
            class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            @click.stop
          />
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

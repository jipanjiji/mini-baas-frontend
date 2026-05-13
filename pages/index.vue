<script setup lang="ts">
interface Project {
  id: string
  name: string
  api_key: string
  created_at: string
}

const { getProjects } = useApi()

const projects = ref<Project[]>([])
const loading = ref(true)
const activeTab = ref<'projects' | 'simulation'>('projects')

const refreshProjects = async () => {
  try {
    const response = await getProjects() as { success: boolean; data: Project[] }
    if (response.success) {
      projects.value = response.data
    }
  } catch (err) {
    console.error('Gagal memuat daftar project:', err)
  }
}

onMounted(async () => {
  loading.value = true
  await refreshProjects()
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ projects.length }}</p>
              <p class="text-sm text-gray-500">Total Project</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">Aktif</p>
              <p class="text-sm text-gray-500">Status API</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-5 sm:col-span-2 lg:col-span-1">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">v1.0</p>
              <p class="text-sm text-gray-500">Versi API</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button
            @click="activeTab = 'projects'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              activeTab === 'projects'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Projects
          </button>
          <button
            @click="activeTab = 'simulation'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              activeTab === 'simulation'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Simulasi
          </button>
        </div>

        <ProjectForm v-if="activeTab === 'projects'" @project-created="refreshProjects" />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="text-center">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent"></div>
          <p class="mt-3 text-sm text-gray-500">Memuat data...</p>
        </div>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Projects Tab -->
        <div v-show="activeTab === 'projects'">
          <ProjectList :projects="projects" />
        </div>

        <!-- Simulation Tab -->
        <div v-show="activeTab === 'simulation'">
          <div class="max-w-xl">
            <SimulationForm :projects="projects" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

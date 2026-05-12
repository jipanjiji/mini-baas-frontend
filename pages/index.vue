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
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mini BaaS Dashboard</h1>
        <p class="mt-1 text-sm text-gray-600">
          Kelola project dan simulasi pengiriman data
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent"></div>
          <p class="mt-2 text-sm text-gray-600">Memuat data...</p>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column: ProjectForm + ProjectList -->
        <div class="space-y-6">
          <ProjectForm @project-created="refreshProjects" />
          <ProjectList :projects="projects" />
        </div>

        <!-- Right Column: SimulationForm -->
        <div>
          <SimulationForm :projects="projects" />
        </div>
      </div>
    </div>
  </div>
</template>

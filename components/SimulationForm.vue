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

const { createEntry } = useApi()

const selectedApiKey = ref('')
const textData = ref('')
const imageFile = ref<File | null>(null)
const loading = ref(false)
const error = ref('')
const successData = ref<{ text_data: string; image_url: string } | null>(null)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    imageFile.value = target.files[0]
  }
}

const handleSubmit = async () => {
  error.value = ''
  successData.value = null

  if (!selectedApiKey.value) {
    error.value = 'Pilih project terlebih dahulu'
    return
  }

  if (!textData.value.trim()) {
    error.value = 'Text data tidak boleh kosong'
    return
  }

  if (!imageFile.value) {
    error.value = 'File gambar harus dipilih'
    return
  }

  loading.value = true

  try {
    const response = await createEntry(selectedApiKey.value, textData.value.trim(), imageFile.value) as {
      success: boolean
      data: { text_data: string; image_url: string }
    }

    if (response.success) {
      successData.value = {
        text_data: response.data.text_data,
        image_url: response.data.image_url
      }
      textData.value = ''
      imageFile.value = null
      // Reset file input
      const fileInput = document.getElementById('image-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    }
  } catch (err: any) {
    error.value = err?.data?.error || err?.message || 'Gagal mengirim data'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Simulasi Pengiriman Data</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="project-select" class="block text-sm font-medium text-gray-700 mb-1">
          Pilih Project
        </label>
        <select
          id="project-select"
          v-model="selectedApiKey"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="loading"
        >
          <option value="" disabled>-- Pilih Project --</option>
          <option
            v-for="project in projects"
            :key="project.id"
            :value="project.api_key"
          >
            {{ project.name }}
          </option>
        </select>
      </div>

      <div>
        <label for="text-data" class="block text-sm font-medium text-gray-700 mb-1">
          Text Data
        </label>
        <input
          id="text-data"
          v-model="textData"
          type="text"
          placeholder="Masukkan teks data"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="loading"
        />
      </div>

      <div>
        <label for="image-file" class="block text-sm font-medium text-gray-700 mb-1">
          File Gambar
        </label>
        <input
          id="image-file"
          type="file"
          accept="image/*"
          @change="handleFileChange"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          :disabled="loading"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ loading ? 'Mengirim...' : 'Kirim Data' }}
      </button>
    </form>

    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>

    <div v-if="successData" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
      <p class="text-sm font-medium text-green-800 mb-2">Data berhasil dikirim!</p>
      <div class="space-y-1 text-sm text-green-700">
        <p><span class="font-medium">Text:</span> {{ successData.text_data }}</p>
        <p><span class="font-medium">Image URL:</span></p>
        <a
          :href="successData.image_url"
          target="_blank"
          class="block text-xs text-blue-600 hover:underline break-all"
        >
          {{ successData.image_url }}
        </a>
      </div>
    </div>
  </div>
</template>

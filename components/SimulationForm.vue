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
const imagePreview = ref('')
const loading = ref(false)
const error = ref('')
const successData = ref<{ text_data: string; image_url: string } | null>(null)
const isDragging = ref(false)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    setFile(target.files[0])
  }
}

const setFile = (file: File) => {
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      setFile(file)
    } else {
      error.value = 'Hanya file gambar yang diizinkan'
    }
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = ''
  const fileInput = document.getElementById('image-file') as HTMLInputElement
  if (fileInput) fileInput.value = ''
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
      imagePreview.value = ''
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
  <div class="bg-white rounded-2xl border border-gray-200 p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-gray-800">Simulasi Pengiriman</h2>
        <p class="text-sm text-gray-500">Kirim data test ke project</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Project Select -->
      <div>
        <label for="project-select" class="block text-sm font-medium text-gray-700 mb-1.5">
          Pilih Project
        </label>
        <select
          id="project-select"
          v-model="selectedApiKey"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
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

      <!-- Text Data -->
      <div>
        <label for="text-data" class="block text-sm font-medium text-gray-700 mb-1.5">
          Text Data
        </label>
        <input
          id="text-data"
          v-model="textData"
          type="text"
          placeholder="Masukkan teks data"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
          :disabled="loading"
        />
      </div>

      <!-- File Upload Area -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          File Gambar
        </label>

        <!-- Preview -->
        <div v-if="imagePreview" class="relative mb-3">
          <img
            :src="imagePreview"
            alt="Preview"
            class="w-full h-48 object-cover rounded-xl border border-gray-200"
          />
          <button
            type="button"
            @click="removeImage"
            class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Drop Zone -->
        <div
          v-else
          @drop.prevent="handleDrop"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          :class="[
            'relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200',
            isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
          ]"
          @click="($refs.fileInput as HTMLInputElement)?.click()"
        >
          <svg class="mx-auto w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm text-gray-600 font-medium">Drag & drop gambar di sini</p>
          <p class="text-xs text-gray-400 mt-1">atau klik untuk memilih file</p>
          <input
            ref="fileInput"
            id="image-file"
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="hidden"
            :disabled="loading"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Mengirim...
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Kirim Data
        </span>
      </button>
    </form>

    <!-- Error -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
      <p class="text-sm text-red-600 flex items-center gap-2">
        <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        {{ error }}
      </p>
    </div>

    <!-- Success -->
    <Transition name="fade">
      <div v-if="successData" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm font-medium text-green-800">Data berhasil dikirim!</p>
        </div>
        <div class="space-y-1 text-sm text-green-700">
          <p><span class="font-medium">Text:</span> {{ successData.text_data }}</p>
          <p class="font-medium">Image:</p>
          <a
            :href="successData.image_url"
            target="_blank"
            class="block text-xs text-indigo-600 hover:underline break-all"
          >
            {{ successData.image_url }}
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

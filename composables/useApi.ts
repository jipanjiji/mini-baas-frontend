export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl

  // Create a new project
  const createProject = async (name: string) => {
    const response = await $fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      body: { name }
    })
    return response
  }

  // Get all projects
  const getProjects = async () => {
    const response = await $fetch(`${baseUrl}/api/projects`)
    return response
  }

  // Create a new entry (requires API key)
  const createEntry = async (apiKey: string, textData: string, imageFile: File) => {
    const formData = new FormData()
    formData.append('text_data', textData)
    formData.append('image', imageFile)

    const response = await $fetch(`${baseUrl}/api/entries`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey
      },
      body: formData
    })
    return response
  }

  // Get entries for a project (public, no auth)
  const getEntries = async (projectId: string) => {
    const response = await $fetch(`${baseUrl}/api/entries/${projectId}`)
    return response
  }

  return {
    createProject,
    getProjects,
    createEntry,
    getEntries
  }
}

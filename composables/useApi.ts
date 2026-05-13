export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl

  const getToken = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem('admin_token')
    }
    return null
  }

  const getAuthHeaders = (): Record<string, string> => {
    const token = getToken()
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
    return {}
  }

  // Login admin
  const login = async (username: string, password: string) => {
    const response = await $fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      body: { username, password }
    })
    return response
  }

  // Logout - clear token
  const logout = () => {
    if (import.meta.client) {
      localStorage.removeItem('admin_token')
    }
  }

  // Check if logged in
  const isLoggedIn = (): boolean => {
    return !!getToken()
  }

  // Create a new project
  const createProject = async (name: string) => {
    const response = await $fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: { name }
    })
    return response
  }

  // Get all projects
  const getProjects = async () => {
    const response = await $fetch(`${baseUrl}/api/projects`, {
      headers: getAuthHeaders()
    })
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
    login,
    logout,
    isLoggedIn,
    createProject,
    getProjects,
    createEntry,
    getEntries
  }
}

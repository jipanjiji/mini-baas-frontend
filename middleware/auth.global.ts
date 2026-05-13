export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const token = localStorage.getItem('admin_token')
  const isLoggedIn = !!token

  if (!isLoggedIn && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (isLoggedIn && to.path === '/login') {
    return navigateTo('/')
  }
})

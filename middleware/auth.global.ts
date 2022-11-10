const ALLOWED = [/^\/auth\/?$/]

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (ALLOWED.some(route => route.test(to.fullPath))) {
    return
  }

  const cookie = useCookie("nuxt3-todo-token-v2")

  if (!cookie || !cookie.value) {
    return navigateTo("/auth")
  }
})
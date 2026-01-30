import { ref } from 'vue'

const isAuthenticated = ref(localStorage.getItem('token') !== null)
const userEmail = ref(localStorage.getItem('userEmail') || '')

const login = (token: string, email: string) => {
  localStorage.setItem('token', token)
  localStorage.setItem('userEmail', email)
  isAuthenticated.value = true
  userEmail.value = email
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userEmail')
  isAuthenticated.value = false
  userEmail.value = ''
}

const isTokenExpired = (): boolean => {
  const token = localStorage.getItem('token')
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export default {
  isAuthenticated,
  userEmail,
  login,
  logout,
  isTokenExpired,
}

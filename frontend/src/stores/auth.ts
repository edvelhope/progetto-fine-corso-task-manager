import { ref } from 'vue';

const isAuthenticated = ref(localStorage.getItem('token') !== null);
const userEmail = ref(localStorage.getItem('userEmail') || '');

const login = (token: string, email: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userEmail', email);
  isAuthenticated.value = true;
  userEmail.value = email; // 🔥 qui aggiorni direttamente il reactive binding
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  isAuthenticated.value = false;
  userEmail.value = '';
};

export default {
  isAuthenticated,
  userEmail,
  login,
  logout
};

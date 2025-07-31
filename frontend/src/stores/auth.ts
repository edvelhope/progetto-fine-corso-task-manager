import { ref } from 'vue';

const isAuthenticated = ref(localStorage.getItem('token') !== null);

const login = (token: string) => {
  localStorage.setItem('token', token);
  isAuthenticated.value = true;
};

const logout = () => {
  localStorage.removeItem('token');
  isAuthenticated.value = false;
};

export default {
  isAuthenticated,
  login,
  logout
};

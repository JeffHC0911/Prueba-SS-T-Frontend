import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import LoginView from '../pages/Login.vue';
import Callback from '../pages/OidcCallback.vue';
import Register from '../pages/Register.vue';
import Confirm from '../pages/Confirm.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/callback', name: 'Callback', component: Callback },
  { path: '/register', name: 'Register', component: Register },
  { path: '/confirm', name: 'Confirm', component: Confirm },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

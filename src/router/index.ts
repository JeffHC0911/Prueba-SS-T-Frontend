import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import LoginView from '../pages/Login.vue';
import Callback from '../pages/OidcCallback.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/callback', name: 'Callback', component: Callback },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

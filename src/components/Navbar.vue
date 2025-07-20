<template>
  <nav class="navbar">
    <div class="logo">App Surveys</div>
    <button @click="logout">Cerrar sesión</button>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import authService from '../services/authService'

const router = useRouter()

const logout = async () => {
  await authService.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  background-color: #6457fa;
  padding: 1em;
  color: white;
  align-items: center;
}
button {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5em 1em;
  cursor: pointer;
  border-radius: 4px;
}
button:hover {
  background: white;
  color: #6457fa;
}
</style>

<template>
  <div>
    <Navbar /> <!-- Navbar sólo visible en Dashboard -->
    <div class="dashboard">
      <h1>Panel de Control</h1>
      <p>Bienvenido, {{ userEmail }}!</p>

      <section class="stats">
        <h2>Estadísticas rápidas</h2>
        <ul>
          <li>Encuestas activas: 5</li>
          <li>Usuarios registrados: 120</li>
          <li>Respuestas pendientes: 32</li>
        </ul>
      </section>

      <section class="actions">
        <!-- ...tu contenido existente... -->
        <button @click="showCreateModal = true">Crear nueva encuesta</button>

        <ModalSurvey v-if="showCreateModal" @close="showCreateModal = false" @created="onSurveyCreated" />
        <button @click="goToResponses">Ver respuestas</button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'

import ModalSurvey from '../components/ModalSurvey.vue'

const showCreateModal = ref(false)

const router = useRouter()
const userEmail = ref('')

async function loadUser() {
  const user = await authService.getUser()
  userEmail.value = user?.email || 'Usuario'
}

onMounted(loadUser)

function goToCreateSurvey() {
  router.push('/create-survey')
}

function goToResponses() {
  router.push('/responses')
}

function onSurveyCreated() {
  showCreateModal.value = false
  // Recarga las encuestas, por ejemplo llamando una función que las trae
}


</script>

<style scoped>
.dashboard {
  padding: 2em;
  font-family: Arial, sans-serif;
}

.stats ul {
  list-style-type: disc;
  margin-left: 1.5em;
}

.actions button {
  margin-right: 1em;
  padding: 0.6em 1.2em;
  background-color: #6457fa;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.actions button:hover {
  background-color: #3ddad7;
}
</style>

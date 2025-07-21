<template>
  <div>
    <Navbar /> <!-- Navbar sólo visible en Dashboard -->
    <div class="dashboard">
      <h1>Panel de Control</h1>
      <p>Bienvenido, {{ userEmail }}!</p>

      <section v-if="userRole === 'admin'" class="stats">
        <h2>Estadísticas rápidas</h2>
        <ul>
          <li>Encuestas activas: {{ surveys.length }}</li>
        </ul>
      </section>

      <!-- Nueva sección para mostrar encuestas -->
      <section class="survey-management">
        <div class="header-with-button">
          <h2>{{ userRole === 'admin' ? 'Mis Encuestas' : 'Encuestas por responder' }}</h2> <button
            v-if="userRole === 'admin'" @click="showCreateModal = true" class="btn-create-survey">Crear nueva
            encuesta</button>
        </div>

        <div v-if="loadingSurveys" class="status-message loading-message">Cargando encuestas...</div>
        <div v-if="surveyLoadError" class="status-message error-message">{{ surveyLoadError }}</div>
        <div v-if="!loadingSurveys && !surveyLoadError && surveys.length === 0" class="status-message info-message">
          {{ userRole === 'admin'
            ? 'Aún no tienes encuestas creadas.'
            : 'No hay encuestas disponibles para responder.'
          }}
        </div>


        <div v-if="surveys.length" class="surveys-grid">
          <SurveyCard v-for="survey in surveys" :key="survey.survey_id" :survey="survey" :userRole="userRole"
            @edit="handleEditSurvey" @delete="handleDeleteSurvey" @view="handleViewSurvey"
            @publish="handlePublishSurvey" />
        </div>
      </section>

      <section class="actions">
        <button disabled v-if="userRole === 'admin'" @click="goToResponses">Ver respuestas</button>
      </section>
    </div>

    <ModalSurvey v-if="showCreateModal" @close="showCreateModal = false" @created="onSurveyCreated" />
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'
import { listSurveys, type Survey, updateSurveyStatus } from '../services/surveyService'
import SurveyCard from '../components/SurveyCard.vue'
import ModalSurvey from '../components/ModalSurvey.vue'

const showCreateModal = ref(false)
const router = useRouter()
const userEmail = ref('')
const surveys = ref<Survey[]>([])
const loadingSurveys = ref(false)
const surveyLoadError = ref<string | null>(null)

const userRole = ref('cliente') // fallback

async function loadUser() {
  const user = await authService.getUser()
  userEmail.value = String(user?.email ?? 'Invitado')
  userRole.value = String(user?.role ?? 'cliente')
}

async function handlePublishSurvey(survey: Survey) {
  try {
    await updateSurveyStatus(survey.survey_id, 'publicado')
    await fetchUserSurveys()
  } catch (e: any) {
    console.error('Error publicando la encuesta:', e.message)
  }
}

async function fetchUserSurveys() {
  loadingSurveys.value = true
  surveyLoadError.value = null

  try {
    const allSurveys = await listSurveys()
    surveys.value = userRole.value === 'admin'
      ? allSurveys
      : allSurveys.filter((s: { status: string }) => s.status === 'publicado')
  } catch (e: any) {
    surveyLoadError.value = e.message || 'Error al cargar las encuestas.'
  } finally {
    loadingSurveys.value = false
  }
}


onMounted(() => {
  loadUser()
  fetchUserSurveys()
})

function goToResponses() {
  router.push('/responses')
}

function onSurveyCreated() {
  showCreateModal.value = false
  fetchUserSurveys()
}

function handleEditSurvey(survey: Survey) {
  console.log('Editar encuesta:', survey.survey_id)
}

function handleDeleteSurvey(survey: Survey) {
  console.log('Eliminar encuesta:', survey.survey_id)
}

function handleViewSurvey(survey: Survey) {
  console.log('Ver encuesta:', survey.survey_id)
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

/* Nueva sección encuestas */
.survey-management {
  margin-top: 2em;
  padding: 1.5em;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5em;
}

.header-with-button h2 {
  margin: 0;
  color: #333;
  font-size: 1.8em;
}

.btn-create-survey {
  padding: 0.7em 1.2em;
  background-color: #4363bd;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-create-survey:hover {
  background-color: #2ab5b2;
}

.status-message {
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 5px;
  text-align: center;
  font-weight: 600;
}

.loading-message {
  background-color: #e0f7fa;
  color: #00796b;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ef9a9a;
}

.info-message {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #90caf9;
}

.surveys-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5em;
}

button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>

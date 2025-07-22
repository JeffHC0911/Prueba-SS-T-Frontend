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

    <div v-if="showPublishModal" class="modal-overlay">
  <div class="modal-content">
    <h3>Publicar encuesta</h3>
    <label>
      Fecha de inicio:
      <input type="datetime-local" v-model="publishStartDate" />
    </label>
    <label>
      Fecha de cierre:
      <input type="datetime-local" v-model="publishEndDate" />
    </label>
    <div class="modal-actions">
      <button @click="confirmPublish">Publicar</button>
      <button @click="cancelPublish">Cancelar</button>
    </div>
  </div>
</div>


  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'
import { deleteSurvey, listSurveys, type Survey, updateSurveyStatus } from '../services/surveyService'
import SurveyCard from '../components/SurveyCard.vue'
import ModalSurvey from '../components/ModalSurvey.vue'

const showCreateModal = ref(false)
const router = useRouter()
const userEmail = ref('')
const surveys = ref<Survey[]>([])
const loadingSurveys = ref(false)
const surveyLoadError = ref<string | null>(null)

const showPublishModal = ref(false)
const selectedSurvey = ref<Survey | null>(null)
const publishStartDate = ref('')
const publishEndDate = ref('')

const userRole = ref('cliente') // fallback

const isDeleting = ref(false)


async function loadUser() {
  const user = await authService.getUser()
  userEmail.value = String(user?.email ?? 'Invitado')
  userRole.value = String(user?.role ?? 'cliente')
}

function handlePublishSurvey(survey: Survey) {
  selectedSurvey.value = survey
  publishStartDate.value = new Date().toISOString().slice(0, 16)
  publishEndDate.value = ''
  showPublishModal.value = true
}

async function confirmPublish() {
  if (!selectedSurvey.value) return
  try {
    await updateSurveyStatus(
      selectedSurvey.value.survey_id,
      'publicado',
      publishStartDate.value,
      publishEndDate.value
    )
    await fetchUserSurveys()
  } catch (e: any) {
    console.error('Error publicando la encuesta:', e.message)
  } finally {
    showPublishModal.value = false
    selectedSurvey.value = null
  }
}

function cancelPublish() {
  showPublishModal.value = false
  selectedSurvey.value = null
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

async function handleDeleteSurvey(survey: Survey) {
  if (!confirm(`¿Seguro que deseas eliminar la encuesta "${survey.title}"?`)) {
    return
  }
  try {
    isDeleting.value = true
    await deleteSurvey(survey.survey_id)
    alert('Encuesta eliminada correctamente.')

    // Actualiza localmente la lista eliminando la encuesta
    surveys.value = surveys.value.filter(s => s.survey_id !== survey.survey_id)

  } catch (error) {
    console.error('Error eliminando encuesta:', error)
    alert('Hubo un problema al eliminar la encuesta.')
  } finally {
    isDeleting.value = false
  }
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 600;
  font-size: 1.5rem;
  text-align: center;
}

.modal-content label {
  display: block;
  margin-bottom: 1.2rem;
  color: #555;
  font-size: 1rem;
}

.modal-content input[type="datetime-local"] {
  margin-top: 0.3rem;
  width: 100%;
  padding: 0.5rem 0.6rem;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.modal-content input[type="datetime-local"]:focus {
  outline: none;
  border-color: #3b82f6; /* Azul vivo */
  box-shadow: 0 0 4px rgba(59,130,246,0.5);
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  font-weight: 600;
  font-size: 1rem;
  padding: 0.6rem 1.8rem;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);
}

.btn-primary:hover {
  background-color: #2563eb;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.6);
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #d1d5db;
  color: #1f2937;
}

</style>

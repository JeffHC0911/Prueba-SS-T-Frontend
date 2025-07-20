<template>
  <div class="survey-list">
    <h1>Encuestas</h1>

    <button @click="showCreate = true">Crear Nueva Encuesta</button>

    <div v-if="loading">Cargando encuestas...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <ul v-if="!loading && !error && surveys.length">
      <li v-for="survey in surveys" :key="survey.survey_id" class="survey-item">
        <strong>{{ survey.title || 'Sin título' }}</strong>
        <button @click="goToDetails(survey.survey_id)">Ver detalle</button>
        <button @click="deleteSurvey(survey.survey_id)">Eliminar</button>
      </li>
    </ul>

    <p v-if="!loading && !error && surveys.length === 0">No hay encuestas disponibles.</p>

    <!-- Modal simple creación -->
    <div v-if="showCreate" class="modal">
      <h2>Crear Encuestra</h2>
      <input v-model="newTitle" placeholder="Título de la encuesta" />
      <button @click="createSurvey">Crear</button>
      <button @click="showCreate = false">Cancelar</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

interface Survey {
  survey_id: string
  title?: string
  [key: string]: any
}

const surveys = ref<Survey[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showCreate = ref(false)
const newTitle = ref('')

// Simula llamada backend: deberías reemplazar por fetch a tu API GetSurvey o endpoint que liste encuestas
async function fetchSurveys() {
  loading.value = true
  error.value = null
  try {
    // Ejemplo con fetch, ajusta URL y headers según tu backend
    // const res = await fetch('https://tu-api/getSurveys', { headers: { Authorization: 'Bearer token' } })
    // if (!res.ok) throw new Error('Error cargando encuestas')
    // surveys.value = await res.json()

    // Mock de ejemplo
    surveys.value = [
      { survey_id: 'abc123', title: 'Encuesta de Satisfacción' },
      { survey_id: 'def456', title: 'Encuesta de Productos' }
    ]
  } catch (err: any) {
    error.value = err.message || 'Error desconocido'
  } finally {
    loading.value = false
  }
}

function goToDetails(id: string) {
  // Usa tu router para navegar a detalle, ej:
  // router.push({ name: 'SurveyDetail', params: { surveyId: id } })
  alert(`Navegar a detalle de encuesta: ${id}`)
}

function deleteSurvey(id: string) {
  // Aquí deberías invocar API y actualizar lista
  alert(`Eliminar encuesta: ${id}`)
}

async function createSurvey() {
  if (!newTitle.value.trim()) {
    alert('El título es requerido')
    return
  }
  
  // Aquí llama a tu API CreateSurvey
  alert(`Crear encuesta con título: ${newTitle.value}`)
  // tras crear, recarga lista o actualiza surveys.value

  showCreate.value = false
  newTitle.value = ''
}

onMounted(() => {
  fetchSurveys()
})
</script>

<style scoped>
.survey-list {
  max-width: 600px;
  margin: auto;
  font-family: Arial, sans-serif;
}
.survey-item {
  margin: 10px 0;
}
.error {
  color: red;
}
.modal {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ccc;
  padding: 1em;
}
</style>

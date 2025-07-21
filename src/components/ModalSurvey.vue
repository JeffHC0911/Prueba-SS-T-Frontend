<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <h3 class="modal-title">Crear Nueva Encuesta</h3>
      <form @submit.prevent="onSubmit" class="form">
        <label for="title" class="form-label">Título *</label>
        <input id="title" v-model="title" required placeholder="Título de la encuesta" class="form-input"
          :disabled="loading" />

        <label for="description" class="form-label">Descripción</label>
        <textarea id="description" v-model="description" placeholder="Descripción opcional" class="form-textarea"
          :disabled="loading"></textarea>

        <h4 class="section-title">Preguntas</h4>
        <div class="questions-container" v-if="questions.length">
          <div v-for="(q, index) in questions" :key="q.question_id" class="question-item">
            <input v-model="q.text" placeholder="Texto de la pregunta" required class="form-input question-text"
              :disabled="loading" />
            <label class="form-label small-label">
              <input type="checkbox" v-model="q.required" :disabled="loading" />
              Obligatoria
            </label>
            <select v-model="q.type" class="form-select" :disabled="loading">
              <option value="text">Texto libre</option>
              <option value="choice">Opción única</option>
              <option value="multiple-choice">Múltiples opciones</option>
            </select>
            <div v-if="q.type === 'choice' || q.type === 'multiple-choice'" class="options-group">
              <label class="form-label small-label">Opciones (separadas por coma):</label>
              <input v-model="q.optionsString" @input="updateOptions(index)" placeholder="Ej: Rojo, Azul, Verde"
                class="form-input" :disabled="loading" />
            </div>
            <button type="button" class="btn btn-danger" @click="removeQuestion(index)" :disabled="loading">
              Eliminar
            </button>
          </div>
        </div>
        <button type="button" class="btn btn-secondary btn-add" @click="addQuestion" :disabled="loading">
          + Agregar pregunta
        </button>

        <div class="actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Creando...' : 'Crear Encuesta' }}
          </button>
          <button type="button" class="btn btn-cancel" @click="emit('close')" :disabled="loading">
            Cancelar
          </button>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createSurvey } from '../services/surveyService'
import { createQuestion } from '../services/questionService'
import authService from '../services/authService'
import { v4 as uuidv4 } from 'uuid'

const emit = defineEmits(['close', 'created'])

const title = ref('')
const description = ref('')
const loading = ref(false)
const error = ref('')

interface Question {
  question_id: string
  text: string
  type: string
  options: string[]
  optionsString: string
  required: boolean
}

const questions = ref<Question[]>([])

function addQuestion() {
  questions.value.push({
    question_id: uuidv4(),
    text: '',
    type: 'text',
    options: [],
    optionsString: '',
    required: false
  })
}

function removeQuestion(index: number) {
  questions.value.splice(index, 1)
}

function updateOptions(index: number) {
  const q = questions.value[index]
  q.options = q.optionsString
    .split(',')
    .map(opt => opt.trim())
    .filter(opt => opt.length > 0)
}

async function onSubmit() {
  error.value = ''
  loading.value = true

  try {
    const user = await authService.getUser()
    if (!user?.username) throw new Error('Usuario no autenticado')

    // Crear encuesta
    const surveyResponse = await createSurvey({
      title: title.value,
      description: description.value,
      admin_id: user.username,
      branding: {},
      template_id: null
    })

    console.log('surveyResponse', surveyResponse)

    const survey_id = surveyResponse.survey_id || surveyResponse.PK?.split('#')[1]
    if (!survey_id) throw new Error('No se pudo obtener el ID de la encuesta creada')

    for (const q of questions.value) {
      await createQuestion({
        survey_id,
        question_id: q.question_id,
        text: q.text,
        type: q.type,
        options: q.options,
        required: q.required
      })
    }

    emit('created')
    emit('close')
  } catch (e: any) {
    error.value = e.message || 'Error al crear la encuesta con preguntas'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  padding: 1rem;
}

/* Modal container */
.modal-content {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(100, 87, 250, 0.2);
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
}

/* Title */
.modal-title {
  margin: 0 0 1.5rem;
  font-weight: 700;
  font-size: 1.75rem;
  color: #4532a0;
  text-align: center;
}

/* Form styles */
.form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
  display: block;
}

.small-label {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.25rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  margin-bottom: 1rem;
  border: 1.8px solid #d2d2d2;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #6457fa;
  box-shadow: 0 0 6px #7e6cff66;
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}

.section-title {
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: #4532a0;
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-item {
  background: #f7f7fc;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #ddd6ff;
  box-shadow: 0 2px 6px rgb(100 87 250 / 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.question-text {
  flex: 1 1 100%;
}

.options-group {
  flex: 1 1 100%;
}

.btn {
  padding: 0.55em 1.2em;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #6457fa;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4e3acf;
}

.btn-danger {
  background-color: #ff5e57;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #e34a41;
}

.btn-secondary {
  background-color: #ccc;
  color: #444;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #aaa;
}

.btn-add {
  margin-bottom: 1rem;
  width: fit-content;
}

.btn-cancel {
  background-color: #888;
  color: white;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #666;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.error-message {
  color: #d13438;
  margin-top: 0.75rem;
  font-weight: 600;
  text-align: center;
}
</style>

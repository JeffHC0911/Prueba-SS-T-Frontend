<template>
  <div class="modal-overlay">
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <h2 id="modalTitle">{{ survey.title }}</h2>
      <p class="modal-description">{{ survey.description }}</p>

      <form @submit.prevent="submitResponse" class="form-survey">
        <div v-for="(question, index) in survey.questions" :key="index" class="question-block">
          <label :for="`q${index}`" class="question-label">{{ question }}</label>
          <input
            v-model="answers[index]"
            :id="`q${index}`"
            type="text"
            class="input-field"
            required
            autocomplete="off"
          />
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn-primary">Enviar respuestas</button>
          <button type="button" class="btn-secondary" @click="emit('close')">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'
import { sendSurveyResponse } from '../services/responseSurvey'

const emit = defineEmits(['close', 'created'])

const props = defineProps<{
  survey: {
    survey_id: string
    title: string
    description: string
    questions?: string[]
  }
  respondentId: string
}>()

const answers = ref<string[]>([])

watch(
  () => props.survey,
  (newSurvey) => {
    if (newSurvey?.questions?.length) {
      answers.value = Array(newSurvey.questions.length).fill('')
    }
  },
  { immediate: true }
)

async function submitResponse() {
  try {
    await sendSurveyResponse({
      survey_id: props.survey.survey_id,
      respondent_id: props.respondentId,
      answers: answers.value,
    })
    alert('¡Respuestas enviadas con éxito!')
    emit('close')
  } catch (e: any) {
    alert('Error al enviar respuestas: ' + e.message)
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  z-index: 2000;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-content {
  background: white;
  padding: 2.5rem 3rem;
  border-radius: 14px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #222;
  overflow-y: auto;
  max-height: 90vh;
}

h2 {
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #222;
  text-align: center;
}

.modal-description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.8rem;
  text-align: center;
}

.form-survey {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.question-block {
  display: flex;
  flex-direction: column;
}

.question-label {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.4rem;
  color: #444;
}

.input-field {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1.8px solid #ccc;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  outline-offset: 2px;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.5);
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 2rem;
}

button {
  padding: 0.65rem 2.3rem;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
  min-width: 130px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.btn-primary:hover {
  background-color: #1e40af;
  box-shadow: 0 8px 20px rgba(30, 64, 175, 0.6);
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  box-shadow: 0 4px 14px rgba(229, 231, 235, 0.9);
}

.btn-secondary:hover {
  background-color: #d1d5db;
  color: #111827;
}
</style>

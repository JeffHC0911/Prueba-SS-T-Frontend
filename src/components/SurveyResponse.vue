<template>
  <div class="response-container">
    <h2>{{ survey?.title }}</h2>
    <form @submit.prevent="handleSubmit">
      <div v-for="(question, index) in survey.questions" :key="index" class="question">
        <label>{{ question.text }}</label>
        <input
          v-model="answers[index]"
          :placeholder="`Respuesta a: ${question.text}`"
          type="text"
          required
        />
      </div>
      <button type="submit">Enviar respuestas</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { submitSurveyResponse, getSurveyById } from '../services/surveyService'
import authService from '../services/authService'

const route = useRoute()
const router = useRouter()
const surveyId = route.params.id as string

const survey = ref<any>(null)
const answers = ref<string[]>([])

onMounted(async () => {
  survey.value = await getSurveyById(surveyId)
})

async function handleSubmit() {
  try {
    const user = await authService.getUser()
    await submitSurveyResponse(
      surveyId,
      answers.value,
      user?.email,
      { submittedAt: new Date().toISOString() }
    )
    alert('Respuesta enviada con éxito')
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Error al enviar respuesta:', error.message)
    alert('Hubo un problema al enviar tus respuestas')
  }
}
</script>

<style scoped>
.response-container {
  max-width: 600px;
  margin: 0 auto;
}
.question {
  margin-bottom: 1em;
}
</style>

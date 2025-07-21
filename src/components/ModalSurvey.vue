<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Crear Nueva Encuesta</h3>
      <form @submit.prevent="onSubmit">
        <label for="title">Título *</label>
        <input id="title" v-model="title" required placeholder="Título de la encuesta" />

        <label for="description">Descripción</label>
        <textarea id="description" v-model="description" placeholder="Descripción opcional"></textarea>

        <button type="submit" :disabled="loading">Crear</button>
        <button type="button" @click="$emit('close')">Cancelar</button>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createSurvey } from '../services/surveyService'
import authService from '../services/authService'

const emit = defineEmits(['close', 'created'])

const title = ref('')
const description = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const user = await authService.getUser()
    if (!user?.username) throw new Error('Usuario no autenticado')

    await createSurvey({
      title: title.value,
      description: description.value,
      admin_id: user.username,
      branding: {},      // Puedes ajustar o agregar inputs para branding/template_id si quieres
      template_id: null
    })

    // Emitimos el evento para indicar creación exitosa
    emit('created')
    // Cerramos el modal
    emit('close')
  } catch (e: any) {
    error.value = e.message || 'Error al crear la encuesta'
  } finally {
    loading.value = false
  }
}


function $emit(arg0: string) {
    throw new Error('Function not implemented.')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff; padding: 1.5em; border-radius: 10px;
  width: 350px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.error {
  color: red; margin-top: 0.5em;
}
button {
  margin-right: 0.5em;
  padding: 0.5em 1em;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
button[type="submit"] {
  background-color: #6457fa;
  color: white;
}
button[type="button"] {
  background-color: #ccc;
}
</style>

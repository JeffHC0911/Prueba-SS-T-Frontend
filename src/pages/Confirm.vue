<template>
  <div class="login-bg">
    <div class="login-card">
      <h2>Verifica tu cuenta</h2>
      <form @submit.prevent="onConfirm">
        <input v-model="code" type="text" placeholder="Código de verificación" required />
        <button type="submit">Confirmar</button>
        <div v-if="error" class="login-error">{{ error }}</div>
        <p v-if="resendSuccess" style="margin-top: 1em; color: green;">Código reenviado</p>
        <p>
          <a href="#" @click.prevent="resendCode">¿No recibiste el código?</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'

const route = useRoute()
const router = useRouter()

const email = ref(route.query.email as string || '')
const code = ref('')
const error = ref('')
const resendSuccess = ref(false)

const onConfirm = async () => {
  error.value = ''
  try {
    await confirmSignUp({ username: email.value, confirmationCode: code.value })
    router.push('/') // vuelve al login tras confirmar
  } catch (e: any) {
    error.value = e.message || 'Error al confirmar'
  }
}

const resendCode = async () => {
  try {
    await resendSignUpCode({ username: email.value })
    resendSuccess.value = true
  } catch (e: any) {
    error.value = e.message || 'No se pudo reenviar el código'
  }
}
</script>

<style scoped>
.confirm-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #6457fa 14%, #3ddad7 90%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
  box-sizing: border-box;
}

.confirm-card {
  background: #f9f9ff;
  max-width: 380px;
  width: 100%;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(101, 87, 250, 0.15);
}

.title {
  font-weight: 700;
  font-size: 2.1rem;
  color: #6457fa;
  text-align: center;
  margin-bottom: 1.8rem;
}

.confirm-form {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

.input-field {
  padding: 0.9rem 1.1rem;
  font-size: 1rem;
  border: 1.5px solid #d1d6ff;
  border-radius: 8px;
  background-color: #f6f8ff;
  color: #333;
  transition: 0.25s border-color ease, 0.25s box-shadow ease;
  outline-offset: 2px;
}

.input-field:focus {
  border-color: #6457fa;
  box-shadow: 0 0 8px #6457fa66;
  background-color: #fff;
  outline: none;
}

.btn {
  padding: 0.9rem 0;
  background-color: #6457fa;
  color: white;
  font-weight: 600;
  font-size: 1.05rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px #6457fa66;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn:hover:not(:disabled) {
  background-color: #3ddad7;
  box-shadow: 0 6px 20px #3ddad799;
}

.btn:disabled {
  background-color: #b3b3e7;
  cursor: not-allowed;
  box-shadow: none;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid #ddd;
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0%   { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}

.error-message {
  margin-top: 1rem;
  color: #f24c4c;
  font-weight: 600;
  text-align: center;
  user-select: none;
}

.success-message {
  margin-top: 1rem;
  color: #2e7d32;
  font-weight: 600;
  text-align: center;
  user-select: none;
}

.resend-text {
  margin-top: 0.8rem;
  font-size: 0.9rem;
  text-align: center;
  color: #444;
  user-select: none;
}

.resend-text a {
  cursor: pointer;
  color: #6457fa;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.resend-text a:hover:not(.disabled) {
  color: #3ddad7;
  text-decoration: underline;
}

.resend-text a.disabled {
  pointer-events: none;
  color: #b3b3e7;
}
</style>

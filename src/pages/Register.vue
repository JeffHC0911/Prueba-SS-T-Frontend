<template>
  <div class="register-container">
    <h1 class="title">Registro</h1>
    <form @submit.prevent="handleRegister" class="register-form" novalidate>
      <input
        v-model="email"
        placeholder="Correo"
        type="email"
        required
        autocomplete="email"
        class="input-field"
      />
      <input
        v-model="password"
        placeholder="Contraseña"
        type="password"
        required
        autocomplete="new-password"
        class="input-field"
      />

      <select v-model="role" required class="select-field">
        <option disabled value="">Selecciona un rol</option>
        <option value="cliente">Cliente</option>
        <option value="admin">Administrador</option>
      </select>

      <button type="submit" class="btn" :disabled="isSubmitting">
        <span v-if="!isSubmitting">Registrarse</span>
        <span v-else class="spinner"></span>
      </button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import authService from '../services/authService';
import router from '../router';

const email = ref('');
const password = ref('');
const role = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

async function handleRegister() {
  errorMessage.value = '';
  if (!role.value) {
    errorMessage.value = 'Debes seleccionar un rol';
    return;
  }
  isSubmitting.value = true;
  try {
    await authService.register(email.value, password.value, role.value);
    alert('Registro exitoso. Verifica tu correo.');
    router.push({ name: 'Confirm', query: { email: email.value } });
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al registrar';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.register-container {
  max-width: 380px;
  margin: 3rem auto;
  background: #f9f9ff;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(101, 87, 250, 0.15);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  font-weight: 700;
  font-size: 2.1rem;
  color: #6457fa;
  text-align: center;
  margin-bottom: 1.8rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

.input-field,
.select-field {
  padding: 0.9rem 1.1rem;
  font-size: 1rem;
  border: 1.5px solid #d1d6ff;
  border-radius: 8px;
  background-color: #f6f8ff;
  color: #333;
  transition: 0.25s border-color ease, 0.25s box-shadow ease;
  outline-offset: 2px;
}

.input-field:focus,
.select-field:focus {
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
</style>

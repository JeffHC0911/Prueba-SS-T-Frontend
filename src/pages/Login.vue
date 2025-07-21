<template>
  <div class="login-bg">
    <div class="login-card">
      <h2>
        <svg width="24" height="24" style="position:relative;top:5px;fill:#6457FA">
          <use href="#key" />
        </svg>
        Ingresar
      </h2>
      <form @submit.prevent="onLogin">
        <input v-model="email" type="email" placeholder="Email" required autofocus autocomplete="username" />
        <input v-model="password" type="password" placeholder="Contraseña" required autocomplete="current-password" />
        <button type="submit" :disabled="loading">
          <span v-if="!loading">Iniciar sesión</span>
          <span v-else class="spinner"></span>
        </button>
        <div v-if="error" class="login-error">{{ error }}</div>
      </form>
      <!-- Dentro de <form> o debajo -->
      <p class="register-link">
        ¿No tienes cuenta?
        <a @click.prevent="router.push('/register')" href="#">Regístrate aquí</a>
      </p>

    </div>
    <!-- SVG sprite icono clave, puedes poner más íconos si deseas -->
    <svg style="display:none;">
      <symbol id="key" viewBox="0 0 24 24">
        <path d="M7 14a5 5 0 1 1 5-5m0 0v8.5a2.5 2.5 0 0 0 5 0V9h4"></path>
      </symbol>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'   // Importa el router
import authService from '../services/authService'

const router = useRouter()   // Instancia del router

const isSignedIn = ref(false)
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const user = ref<{ email: string; username?: string } | null>(null)

async function fetchCurrentUser() {
  const u = await authService.getUser()
  user.value = u
  isSignedIn.value = !!u
}

onMounted(fetchCurrentUser)

const onLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await authService.login(email.value, password.value)
    if (res.isSignedIn) {
      router.push('/callback')  // Redirige al dashboard tras login exitoso
    } else {
      error.value = 'Falta completar paso adicional de autenticación'
    }
  } catch (e: any) {
    error.value = e.message || 'Login fallido'
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.login-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #6457fa 14%, #3ddad7 90%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}

.login-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 6px 32px 0 rgba(60, 60, 130, .08), 0 1.5px 8px 0 rgba(60, 60, 130, 0.09);
  padding: 2.2em 2.2em 2em 2.2em;
  min-width: 320px;
  max-width: 94vw;
  animation: popin .5s cubic-bezier(.36, 1.62, .46, .87) 1;
  transition: box-shadow 0.2s;
}

@keyframes popin {
  0% {
    transform: scale(.95) translateY(40px);
    opacity: 0;
  }

  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.login-card h2 {
  text-align: center;
  margin-bottom: 1.7em;
  font-weight: 700;
  letter-spacing: -.3px;
  color: #6457fa;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.1em;
}

input {
  padding: .82em 1em;
  border: 1.2px solid #e6e6ec;
  border-radius: 7px;
  font-size: 1em;
  transition: border .15s, box-shadow .15s;
  background: #f8f8fd;
}

input:focus {
  border-color: #6457fa;
  background: #f5f7ff;
  outline: none;
  box-shadow: 0 1px 6px 0 #6457fa23;
}

button[type="submit"],
.logout-btn {
  margin-top: .2em;
  font-size: 1.01em;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg, #7657fa 0%, #3ddad7 80%);
  border: none;
  padding: .87em 0;
  border-radius: 7px;
  cursor: pointer;
  transition: box-shadow .15s, background .15s;
  box-shadow: 0 1px 4px 0 #3ddad70d;
  position: relative;
}

button[disabled] {
  opacity: .7;
  pointer-events: none;
}

button:hover:not([disabled]),
.logout-btn:hover {
  background: linear-gradient(90deg, #3ddad7 0%, #7657fa 85%);
  box-shadow: 0 2px 10px 0 #6457fa18;
}

.login-error {
  margin-top: .7em;
  color: #f24c4c;
  font-weight: 500;
  text-align: center;
  background: #fff5f5;
  border-radius: 5px;
  padding: .67em 1em;
  font-size: .98em;
  border: 1px solid #ffd1d1;
  animation: shake 0.35s;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  22% {
    transform: translateX(-7px);
  }

  50% {
    transform: translateX(4px);
  }

  80% {
    transform: translateX(-2px);
  }

  100% {
    transform: translateX(0);
  }
}

.spinner {
  display: inline-block;
  width: 17px;
  height: 17px;
  border: 3px solid #aaa;
  border-radius: 50%;
  border-top: 3px solid #6457fa;
  animation: spin 1s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.user-info {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 1.1em;
}

.user-icon {
  width: 54px;
  height: 54px;
  line-height: 54px;
  border-radius: 50%;
  background: #6457fa15;
  color: #6457fa;
  font-weight: bold;
  font-size: 2.1em;
  text-align: center;
  margin-bottom: .8em;
  box-shadow: 0 1px 6px 0 #6457fa23;
  letter-spacing: 0.02em;
}

.profile {
  margin-top: 1.2em;
  background: #f6f6fc;
  border-radius: 7px;
  font-size: .97em;
  padding: 0.6em .6em;
  overflow-x: auto;
  color: #222;
  border: 1px solid #eee;
}

.register-link {
  margin-top: 1em;
  text-align: center;
  font-size: 0.95em;
}
.register-link a {
  color: #6457fa;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.2em .5em;
    min-width: 95vw;
  }
}
</style>

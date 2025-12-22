<template>
  <q-page class="login-page flex flex-center">
    <q-card class="login-card q-pa-lg">

      <!-- ================= LOGIN ================= -->
      <template v-if="mode === 'login'">

        <div class="text-center q-mb-sm">
          <q-avatar size="48px" color="teal" text-color="white">🎓</q-avatar>
        </div>

        <div class="text-h6 text-center q-mb-xs">
          Вход в систему
        </div>

        <div class="text-caption text-grey text-center q-mb-md">
          Реестр студентов-выпускников
        </div>

        <div v-if="authError" class="text-negative text-center q-mb-sm error-text">
          Неправильный логин или пароль
        </div>

        <q-input v-model="login" label="Логин или Email" outlined dense class="q-mb-sm" :error="authError"
          @update:model-value="clearError" />

        <q-input v-model="password" label="Пароль" type="password" outlined dense class="q-mb-md" :error="authError"
          @update:model-value="clearError" />

        <q-btn label="Войти в реестр" color="teal" unelevated class="full-width q-mb-sm" @click="onLogin" />

        <div class="text-center">
          <a class="forgot-link" href="#" @click.prevent="mode = 'recovery'">
            Забыли пароль?
          </a>
        </div>

      </template>

      <!-- ================= RECOVERY ================= -->
      <template v-else>

        <div class="text-h6 text-center q-mb-md">
          Восстановление доступа
        </div>

        <div class="text-body2 text-center q-mb-lg">
          Для восстановления доступа к системе
          свяжитесь с администратором.
        </div>

        <div class="text-center text-h6 q-mb-xl phone">
          +7 999 999-99-99
        </div>

        <q-btn label="Войти в реестр" color="teal" unelevated class="full-width" @click="mode = 'login'" />

      </template>

    </q-card>
  </q-page>
</template>


<script>
import { login as loginRequest } from '../services/auth'

export default {
  name: 'LoginPage',
  data() {
    return {
      login: '',
      password: '',
      authError: false,
      mode: 'login',
    }
  },
  methods: {
    async onLogin() {
      this.authError = false

      try {
        const { data } = await loginRequest({
          login: this.login,
          password: this.password
        })

        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('role', data.role)

        this.$router.push('/home')
      } catch (e) {
        this.authError = true
      }
    },
    clearError() {
      if (this.authError) {
        this.authError = false
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  background: #f5f7f9;
}

.login-card {
  width: 420px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.forgot-link {
  font-size: 13px;
  color: #00897b;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.error-text {
  font-size: 13px;
}

.phone {
  letter-spacing: 1px;
}
</style>

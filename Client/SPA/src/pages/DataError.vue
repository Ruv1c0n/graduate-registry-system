<template>
  <q-page class="flex flex-center bg-white">
    <q-card class="error-card" flat>
      <!-- Синяя полоска слева -->
      <div class="blue-border"></div>

      <q-card-section class="q-px-xl q-pt-xl">
        <!-- Заголовок 404 -->
        <div class="text-center q-mb-md">
          <div class="text-h1 text-weight-bold text-grey-4" style="font-size: 72px; line-height: 1;">
            404
          </div>
        </div>

        <!-- Основной заголовок -->
        <div class="text-center text-h5 text-weight-bold text-red-7 q-mb-md">
          Запись не найдена
        </div>
      </q-card-section>

      <q-card-section class="q-px-xl">
        <!-- Сообщение -->
        <div class="text-body1 text-grey-7 text-center q-mb-xl">
          Похоже, студент был удален из реестра или вы ввели неверные данные карточки.
        </div>
      </q-card-section>

      <q-card-actions class="q-px-xl q-pb-xl" align="center">
        <!-- Кнопка возврата -->
        <q-btn label="Вернуться в реестр" color="primary" padding="12px 32px"
          @click="goToRegistry" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRegistry = () => {
  // Предполагаем, что путь к реестру студентов - '/students'
  router.push('/')
}
</script>

<style lang="scss" scoped>
.error-card {
  border-radius: 16px;
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.5) !important;
  width: 500px;
  max-width: 90vw;
  position: relative;
  overflow: hidden;
}

.text-body1 {
  font-size: 14px;
  line-height: 21px;
  font-family: 'Inter', sans-serif;
}

.q-btn {
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
}
</style>

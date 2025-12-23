<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="error-card" flat>
      <q-card-section class="q-pt-xl q-px-xl">
        <div class="text-h5 text-weight-bold text-negative q-mb-md">
          🔌 Ошибка соединения с БД
        </div>
      </q-card-section>

      <q-card-section class="q-px-xl">
        <div class="text-body1 text-grey-7 q-mb-xl">
          <p class="q-mb-xs">Система не может получить ответ от сервера базы данных PostgreSQL.</p>
          <p>Технические службы уже уведомлены.</p>
        </div>
      </q-card-section>

      <q-card-actions class="q-px-xl q-pb-xl">
        <q-btn label="Обновить страницу" color="grey-7" outline padding="10px 20px" class="full-width"
          @click="refreshPage" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
const refreshPage = () => {
  window.location.reload()
}
</script>

<style lang="scss" scoped>
.error-card {
  border-radius: 16px;
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.5) !important;
  width: 500px;
  max-width: 90vw;
  border-left: 4px solid #e74c3c !important;
}

.text-negative {
  color: #e74c3c;
}

.text-grey-7 {
  color: #666;
}

.q-btn {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13.8px;
  font-family: 'Inter', sans-serif;

  &:hover {
    background-color: #f8f9fa;
  }
}

.text-body1 {
  font-size: 14px;
  line-height: 21px;
  font-family: 'Inter', sans-serif;
}

.text-h5 {
  font-size: 20px;
  font-family: 'Inter', sans-serif;
}
</style>

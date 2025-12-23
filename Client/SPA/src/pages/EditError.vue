<template>
  <q-page class="flex flex-center bg-white">
    <q-card class="figma-card" flat>
      <q-card-section class="figma-section">
        <div class="figma-title-container">
          <div class="figma-title">⚠️ Ошибка сохранения</div>
        </div>

        <div class="figma-main-message q-mb-lg">
          Не удалось создать запись. Пожалуйста, исправьте ошибки в полях ниже и попробуйте снова.
        </div>

        <div class="field-error-section q-mb-lg">
          <div class="field-label">Номер студенческого билета</div>
          <div class="field-value-display">1030044</div>
          <div class="field-error-message">
            Студент с таким номером уже зарегистрирован в базе данных PostgreSQL.
          </div>
        </div>

        <div class="buttons-container">
          <q-btn flat class="cancel-button" @click="goBack">
            Отмена
          </q-btn>

          <q-btn flat class="check-button" @click="checkData">
            Проверить данные
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const checkData = () => {
}
</script>

<style lang="scss" scoped>
.figma-card {
  border-radius: 16px;
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.5) !important;
  position: relative;
  overflow: hidden;

  // Красная полоска слева
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: #e74c3c;
  }
}

.figma-section {
  padding: 41px 41px 41px 45px !important;
}

.figma-title-container {
  margin-bottom: 16px;
}

.figma-title {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
  font-family: 'Inter', sans-serif;
  line-height: 1.2;
}

.figma-main-message {
  font-size: 14px;
  line-height: 21px;
  color: #666;
  font-family: 'Inter', sans-serif;
  margin-bottom: 24px;
}

.field-error-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  font-family: 'Inter', sans-serif;
  margin-bottom: 8px;
}

.field-value-display {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: #333;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}

.field-error-message {
  font-size: 14px;
  line-height: 1.4;
  color: #e74c3c;
  font-family: 'Inter', sans-serif;
}

.buttons-container {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-button {
  padding: 10px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  font-family: 'Inter', sans-serif;
  min-height: auto;

  &:hover {
    background-color: #f8f9fa;
  }
}

.check-button {
  padding: 10px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  min-height: auto;
  background-color: $primary;

  &:hover {
    background-color: #e6f2ff;
  }

  :deep(.q-btn__content) {
    line-height: 1;
  }
}
</style>

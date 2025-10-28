<template>
  <q-page class="q-pa-md">
    <!-- Хлебные крошки -->
    <div class="row items-center q-mb-md">
      <q-btn flat dense icon="arrow_back" label="К списку студентов" @click="router.back()" class="q-mr-md" />
      <q-space />
      <div class="text-caption text-grey">
        ID: {{ student?.id }}
      </div>
    </div>

    <!-- Карточка студента -->
    <div v-if="student" class="student-detail">
      <!-- Заголовок -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-h4">{{ student.fullName }}</div>
          <div class="text-subtitle1 text-grey">
            {{ getStatusText(student) }}
          </div>
        </div>
        <div class="col-auto">
          <q-badge :color="student.isArchived ? 'grey' : 'positive'"
            :label="student.isArchived ? 'Архивный' : 'Активный'" class="q-mr-sm" />
          <q-badge :color="student.isSuccess ? 'positive' : 'negative'"
            :label="student.isSuccess ? 'Успешно' : 'Не успешно'" />
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Основная информация -->
        <div class="col-12 col-md-6">
          <q-card class="info-card">
            <q-card-section>
              <div class="text-h6">Основная информация</div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-gutter-y-md">
              <!-- Номер студенческого билета -->
              <div class="info-row">
                <div class="info-label">Номер студенческого билета:</div>
                <div class="info-value">{{ student.id }}</div>
              </div>

              <!-- Ступень образования -->
              <div class="info-row">
                <div class="info-label">Ступень образования:</div>
                <div class="info-value">{{ student.educationLevel }}</div>
              </div>

              <!-- Год поступления -->
              <div class="info-row">
                <div class="info-label">Год поступления:</div>
                <div class="info-value">{{ student.admissionYear }}</div>
              </div>

              <!-- Год окончания -->
              <div class="info-row" v-if="student.graduationYear">
                <div class="info-label">Год окончания:</div>
                <div class="info-value">{{ student.graduationYear }}</div>
              </div>

              <!-- Кафедра -->
              <div class="info-row">
                <div class="info-label">Кафедра:</div>
                <div class="info-value">{{ student.departmentName }}</div>
              </div>

              <!-- Факультет -->
              <div class="info-row" v-if="student.facultyName">
                <div class="info-label">Факультет:</div>
                <div class="info-value">{{ student.facultyName }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Учебные работы -->
        <div class="col-12 col-md-6">
          <q-card class="info-card">
            <q-card-section>
              <div class="text-h6">Учебные работы</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div v-if="studentWorks.length > 0" class="q-gutter-y-md">
                <div v-for="work in studentWorks" :key="work.id" class="work-item row items-center">
                  <div class="col">
                    <div class="work-title">{{ work.title }}</div>
                    <div class="work-type text-caption text-grey">
                      {{ work.type }}
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-badge :color="getGradeColor(work.grade)" :label="work.grade" />
                  </div>
                </div>
              </div>
              <div v-else class="text-grey text-center q-py-lg">
                Нет данных об учебных работах
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Действия -->
      <div class="row q-mt-lg" v-if="!student.isArchived">
        <div class="col">
          <q-card>
            <q-card-section>
              <div class="text-h6">Действия</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="Редактировать" color="primary" icon="edit" @click="showEditForm = true"
                :disable="student?.isArchived" />
              <q-btn v-if="!student?.isArchived" label="Перевести в архив" color="grey" icon="archive"
                @click="handleArchive" />
              <q-btn v-else label="Вернуть из архива" color="positive" icon="unarchive" @click="handleUnarchive" />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- Состояние загрузки -->
      <div v-else-if="loading" class="text-center q-pa-xl">
        <q-spinner-gears size="50px" color="primary" />
        <div class="q-mt-md">Загрузка данных студента...</div>
      </div>

      <!-- Состояние ошибки -->
      <div v-else-if="error" class="text-center q-pa-xl">
        <q-icon name="error" size="50px" color="negative" />
        <div class="q-mt-md text-h6">Ошибка загрузки данных</div>
        <div class="q-mt-sm text-grey">{{ error }}</div>
        <q-btn label="Попробовать снова" color="primary" class="q-mt-md" @click="loadStudent" />
      </div>
    </div>
      <!-- Форма редактирования -->
      <StudentForm v-model="showEditForm" :student="student" @submit="handleEditSubmit" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentStore } from 'src/stores/student-store'
import { useQuasar } from 'quasar'
import StudentForm from 'src/components/student/StudentForm.vue'
import type { Student } from 'src/types/students'

const route = useRoute()
const router = useRouter()
const studentStore = useStudentStore()
const $q = useQuasar()

const student = ref<Student | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const showEditForm = ref(false)

// Тестовые данные для учебных работ
const studentWorks = computed(() => [
  {
    id: 1,
    title: 'Разработка системы управления реестром студентов',
    type: 'Дипломная работа',
    grade: 'Отлично'
  },
  {
    id: 2,
    title: 'Исследование алгоритмов машинного обучения',
    type: 'Курсовая работа',
    grade: 'Хорошо'
  }
])

// Загрузка данных студента
const loadStudent = async () => {
  const studentId = route.params.id as string
  if (!studentId) {
    error.value = 'ID студента не указан'
    return
  }

  loading.value = true
  error.value = null

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Используем метод store для получения студента
    const foundStudent = await studentStore.getStudentById(studentId)
    if (foundStudent) {
      student.value = foundStudent
    } else {
      // Если не нашли в store, ищем в моках напрямую
      const mockStudent = studentStore.students.find((s: Student) => s.id === studentId)
      if (mockStudent) {
        student.value = mockStudent
      } else {
        error.value = 'Студент не найден'
      }
    }
  } catch (err) {
    console.error('Ошибка загрузки студента:', err)
    error.value = 'Не удалось загрузить данные студента'
  } finally {
    loading.value = false
  }
}

// Вспомогательные функции
const getStatusText = (stud: Student) => {
  if (stud.isArchived) {
    return stud.isSuccess ? 'Выпускник' : 'Отчислен'
  }
  return 'Обучается'
}

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'Отлично': return 'positive'
    case 'Хорошо': return 'warning'
    case 'Удовлетворительно': return 'negative'
    default: return 'grey'
  }
}

// Обработчики действий
const handleEdit = () => {
  showEditForm.value = true
}

// Исправляем тип any
interface StudentFormData {
  id: string
  fullName: string
  admissionYear: number
  graduationYear?: number
  educationLevel: string
  isSuccess: boolean
  departmentId: number
  isArchived: boolean
}

const handleEditSubmit = async (studentData: StudentFormData) => {
  try {
    if (student.value) {
      await studentStore.updateStudent(student.value.id, studentData)
      $q.notify({
        type: 'positive',
        message: 'Данные студента успешно обновлены'
      })
      await loadStudent() // Перезагружаем данные
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при обновлении данных студента'
    })
  }
}

// Создаем отдельные асинхронные функции для обработки архивов
const archiveStudentHandler = async () => {
  if (!student.value) return

  try {
    await studentStore.archiveStudent(student.value.id)
    $q.notify({
      type: 'positive',
      message: 'Студент переведен в архив'
    })
    await loadStudent()
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при переводе в архив'
    })
  }
}

const unarchiveStudentHandler = async () => {
  if (!student.value) return

  try {
    await studentStore.unarchiveStudent(student.value.id)
    $q.notify({
      type: 'positive',
      message: 'Студент возвращен из архива'
    })
    await loadStudent()
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при возврате из архива'
    })
  }
}

// Синхронные обработчики для кнопок
const handleArchive = () => {
  if (!student.value) return

  $q.dialog({
    title: 'Подтверждение',
    message: `Перевести студента ${student.value.fullName} в архив?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void archiveStudentHandler() // Явно игнорируем Promise с void
  })
}

const handleUnarchive = () => {
  if (!student.value) return

  $q.dialog({
    title: 'Подтверждение',
    message: `Вернуть студента ${student.value.fullName} из архива?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void unarchiveStudentHandler() // Явно игнорируем Promise с void
  })
}

// Загружаем данные при монтировании
onMounted(() => {
  void loadStudent()
})
</script>
<style lang="scss" scoped>
.student-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  height: 100%;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-weight: 500;
  color: #666;
  flex-shrink: 0;
  margin-right: 16px;
}

.info-value {
  text-align: right;
  font-weight: 600;
  color: #333;
}

.work-item {
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.work-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.work-type {
  font-size: 0.875rem;
}
</style>

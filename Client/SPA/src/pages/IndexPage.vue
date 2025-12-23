<template>
  <q-page class="q-pa-md">
    <div class="page-header row items-center q-ma-md">
      <div class="text-div col">
        <div class="text-holder text-h5 text-weight-bold">Список студентов</div>
      </div>
      <div class="btn-div col-auto">
        <q-btn class="btn-add-student text-white" icon="add" label="Добавить студента" @click="handleAddStudent" />
      </div>
    </div>

    <!-- Компонент поиска и фильтров -->
    <SearchFilters :search-params="studentStore.searchParams" @search="handleSearch" />

    <!-- Таблица студентов -->
    <StudentTable :students="studentStore.students" :loading="studentStore.loading" @row-click="handleRowClick"
      @view-student="handleShowStudentCard" class="q-mt-md" />

    <!-- Форма создания/редактирования студента -->
    <q-dialog v-model="showStudentCard" persistent>
      <StudentCard :student="selectedStudent" :is-edit-mode="isEditMode" @create="handleCreateSubmit"
        @update="handleUpdateSubmit" @cancel="handleCancel" @close="handleCancel" />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore } from 'src/stores/student-store'
import { useQuasar } from 'quasar'
import StudentTable from 'src/components/student/StudentTable.vue'
import SearchFilters from 'src/components/student/SearchFilters.vue'
import StudentCard from 'src/components/student/StudentCard.vue'
import type { Student } from 'src/types/students'
import type { StudentSearchParams } from 'src/types/students'

const router = useRouter()
const studentStore = useStudentStore()
const $q = useQuasar()
const showStudentCard = ref(false) // Убрали дублирование v-model
const selectedStudent = ref<Student | null>(null)
const isEditMode = ref(false)

// Загружаем студентов при монтировании
onMounted(async () => {
  try {
    await studentStore.fetchStudents()
  } catch (error) {
    console.error('Ошибка загрузки студентов:', error)
    $q.notify({
      type: 'negative',
      message: 'Не удалось загрузить список студентов'
    })
  }
})

const handleSearch = async (params: StudentSearchParams) => {
  try {
    await studentStore.fetchStudents(params)
  } catch (error) {
    console.error('Ошибка поиска студентов:', error)
  }
}

const handleRowClick = (student: Student) => {
  // Можно добавить навигацию или другую логику
  console.log('Выбран студент:', student)
}

const handleShowStudentCard = (student: Student) => {
    console.log('handleShowStudentCard called with:', student)
    selectedStudent.value = {
    id: student.id || '',
    fullName: student.fullName || '',
    admissionYear: student.admissionYear,
    graduationYear: student.graduationYear,
    educationLevel: student.educationLevel || '',
    educationStatus: student.educationStatus || '',
    departmentId: student.departmentId || 0,
    isArchived: student.isArchived || false,
    facultyName: student.facultyName || '',
  }
  isEditMode.value = false // Режим просмотра
  showStudentCard.value = true
}

// Обработчик для кнопки "Добавить студента"
const handleAddStudent = () => {
  selectedStudent.value = null // Новый студент
  isEditMode.value = true // Режим редактирования (создание)
  showStudentCard.value = true
}

// Обработчик создания нового студента
const handleCreateSubmit = async (studentData: Partial<Student>) => {
  try {
    const newStudent = await studentStore.createStudent(studentData)
    $q.notify({
      type: 'positive',
      message: `Студент ${newStudent.fullName} успешно создан`
    })
    showStudentCard.value = false
    await studentStore.fetchStudents()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при создании студента'
    })
    console.error('Ошибка создания студента:', error)
  }
}

// Обработчик обновления студента
const handleUpdateSubmit = async (studentData: Student) => {
  try {
    if (!studentData.id) {
      throw new Error('ID студента не указан')
    }

    await studentStore.updateStudent(studentData)
    $q.notify({
      type: 'positive',
      message: 'Студент успешно обновлен'
    })
    showStudentCard.value = false
    await studentStore.fetchStudents()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при обновлении студента'
    })
    console.error('Ошибка обновления студента:', error)
  }
}

// Обработчик отмены
const handleCancel = () => {
  showStudentCard.value = false
  selectedStudent.value = null
}
</script>

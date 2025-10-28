<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h4">Реестр студентов-выпускников</div>
        <div class="text-subtitle1 text-grey-7">
          Управление данными студентов-выпускников
        </div>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Добавить студента" @click="showCreateForm = true" />
      </div>
    </div>

    <!-- Компонент поиска и фильтров -->
    <SearchFilters :search-params="studentStore.searchParams" @search="handleSearch" />

    <!-- Таблица студентов -->
    <StudentTable :students="studentStore.students" :loading="studentStore.loading" @row-click="handleRowClick"
      @view-student="handleViewStudent" class="q-mt-md" />

    <!-- Форма создания студента -->
    <StudentForm v-model="showCreateForm" @submit="handleCreateSubmit" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore } from 'src/stores/student-store'
import { useQuasar } from 'quasar'
import StudentTable from 'src/components/student/StudentTable.vue'
import SearchFilters from 'src/components/student/SearchFilters.vue'
import StudentForm from 'src/components/student/StudentForm.vue'
import type { Student } from 'src/types/students'
import type { StudentSearchParams } from 'src/types/students'

const router = useRouter()
const studentStore = useStudentStore()
const $q = useQuasar()
const showCreateForm = ref(false)

// Загружаем студентов при монтировании
onMounted(async () => {
  try {
    await studentStore.fetchStudents()
  } catch (error) {
    console.error('Ошибка загрузки студентов:', error)
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
  console.log('Выбран студент:', student)
}

const handleViewStudent = (student: Student) => {
  void router.push(`/student/${student.id}`)
}

// Обработчик создания нового студента
const handleCreateSubmit = async (studentData: StudentFormData) => {
  try {
    const newStudent = await studentStore.createStudent(studentData)
    $q.notify({
      type: 'positive',
      message: `Студент ${newStudent.fullName} успешно создан`
    })
    // Обновляем список студентов
    await studentStore.fetchStudents()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при создании студента'
    })
    console.error('Ошибка создания студента:', error)
  }
}
</script>

<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h4">Реестр студентов-выпускников</div>
        <div class="text-subtitle1 text-grey-7">
          Управление данными студентов-выпускников
        </div>
      </div>
    </div>

    <!-- Компонент поиска и фильтров -->
    <SearchFilters :search-params="studentStore.searchParams" @search="handleSearch" />

    <!-- Таблица студентов -->
    <StudentTable :students="studentStore.students" :loading="studentStore.loading" @row-click="handleRowClick"
      @view-student="handleViewStudent" class="q-mt-md" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore } from 'src/stores/student-store'
import StudentTable from 'src/components/student/StudentTable.vue'
import SearchFilters from 'src/components/student/SearchFilters.vue'
import type { Student, StudentSearchParams } from 'src/types/students'

const router = useRouter()
const studentStore = useStudentStore()
const initialized = ref(false)

// Добавим watch для отладки
watch(() => studentStore.students, (students) => {
  console.log('Students updated:', students)
}, { immediate: true })

watch(() => studentStore.loading, (loading) => {
  console.log('Loading:', loading)
})

// Загружаем студентов при монтировании
onMounted(async () => {
  console.log('Component mounted, fetching students...')
  try {
    await studentStore.fetchStudents()
    initialized.value = true
    console.log('Students after fetch:', studentStore.students)
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
</script>

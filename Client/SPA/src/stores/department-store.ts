import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
// import { api } from 'boot/axios' // Пока не используется - комментируем
import type { Department } from 'src/types/students'

export const useDepartmentStore = defineStore('departments', () => {
  const departments: Ref<Department[]> = ref([])
  const loading: Ref<boolean> = ref(false)

  // Временные моки для тестирования
  const mockDepartments: Department[] = [
    {
      id: 1,
      name: 'Программная инженерия',
      headName: 'Иванов П.С.',
      facultyId: 1,
      facultyName: 'ФИиВТ'
    },
    {
      id: 2,
      name: 'Информатика и вычислительная техника',
      headName: 'Петрова А.В.',
      facultyId: 1,
      facultyName: 'ФИиВТ'
    },
    {
      id: 3,
      name: 'Прикладная математика',
      headName: 'Сидоров М.К.',
      facultyId: 1,
      facultyName: 'ФИиВТ'
    }
  ]

  const fetchDepartments = async (): Promise<void> => {
    loading.value = true
    try {
      // TODO: Заменить на реальный API
      await new Promise(resolve => setTimeout(resolve, 500))
      departments.value = mockDepartments
    } catch (error) {
      console.error('Failed to fetch departments:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    departments,
    loading,
    fetchDepartments
  }
})

import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { api } from 'boot/axios'
import type { Department } from 'src/types/students'

export const useDepartmentStore = defineStore('departments', () => {
  const departments: Ref<Department[]> = ref([])
  const loading: Ref<boolean> = ref(false)

  const fetchDepartments = async (): Promise<void> => {
    loading.value = true
    try {
      const response = await api.get<Department[]>('/departments')
      departments.value = response.data
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

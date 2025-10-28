import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { api } from 'boot/axios'
import type { Student, StudentSearchParams } from 'src/types/students'

export const useStudentStore = defineStore('students', () => {
  const students: Ref<Student[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const searchParams: Ref<StudentSearchParams> = ref({})

  const fetchStudents = async (params: StudentSearchParams = {}): Promise<void> => {
    loading.value = true
    searchParams.value = { ...searchParams.value, ...params }

    try {
      const response = await api.get<Student[]>('/students', {
        params: searchParams.value
      })
      students.value = response.data
    } catch (error) {
      console.error('Failed to fetch students:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getStudentById = async (id: string): Promise<Student | null> => {
    try {
      const response = await api.get<Student>(`/students/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch student:', error)
      return null
    }
  }

  return {
    students,
    loading,
    searchParams,
    fetchStudents,
    getStudentById
  }
})

import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
// import { api } from 'boot/axios' // Пока не используется - комментируем
import type { Student, StudentSearchParams } from 'src/types/students'

export const useStudentStore = defineStore('students', () => {
  const students: Ref<Student[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const searchParams: Ref<StudentSearchParams> = ref({})

  // Моки данных
  const mockStudents: Student[] = [
    {
      id: 'ST001',
      fullName: 'Иванов Иван Иванович',
      admissionYear: 2020,
      graduationYear: 2024,
      educationLevel: 'Бакалавриат',
      isSuccess: true,
      departmentId: 1,
      departmentName: 'Программная инженерия',
      facultyName: 'ФИиВТ',
      isArchived: true
    },
    {
      id: 'ST002',
      fullName: 'Петрова Анна Сергеевна',
      admissionYear: 2021,
      graduationYear: 2025,
      educationLevel: 'Магистратура',
      isSuccess: false,
      departmentId: 2,
      departmentName: 'Информатика и вычислительная техника',
      facultyName: 'ФИиВТ',
      isArchived: false
    },
    {
      id: 'ST003',
      fullName: 'Сидоров Михаил Алексеевич',
      admissionYear: 2019,
      graduationYear: 2023,
      educationLevel: 'Специалитет',
      isSuccess: true,
      departmentId: 1,
      departmentName: 'Программная инженерия',
      facultyName: 'ФИиВТ',
      isArchived: true
    },
    {
      id: 'ST004',
      fullName: 'Козлова Елена Дмитриевна',
      admissionYear: 2022,
      educationLevel: 'Бакалавриат',
      isSuccess: true,
      departmentId: 3,
      departmentName: 'Прикладная математика',
      facultyName: 'ФИиВТ',
      isArchived: false
    }
  ]

  const fetchStudents = async (params: StudentSearchParams = {}): Promise<void> => {
    console.log('fetchStudents called with params:', params)
    loading.value = true
    searchParams.value = { ...searchParams.value, ...params }

    try {
      // Имитация загрузки
      await new Promise(resolve => setTimeout(resolve, 500))

      // Фильтрация моковых данных
      const filteredStudents = mockStudents.filter(student => {
        let match = true

        if (params.search) {
          const searchTerm = params.search.toLowerCase()
          match = match && (
            student.fullName.toLowerCase().includes(searchTerm) ||
            student.id.toLowerCase().includes(searchTerm)
          )
        }

        if (params.departmentId !== undefined) {
          match = match && student.departmentId === params.departmentId
        }

        if (params.educationLevel) {
          match = match && student.educationLevel === params.educationLevel
        }

        if (params.isArchived !== undefined) {
          match = match && student.isArchived === params.isArchived
        }

        return match
      })

      console.log('Filtered students:', filteredStudents)
      students.value = filteredStudents

    } catch (error) {
      console.error('Failed to fetch students:', error)
      throw error
    } finally {
      loading.value = false
      console.log('Loading finished, students:', students.value)
    }
  }

  const getStudentById = async (id: string): Promise<Student | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const foundStudent = mockStudents.find(student => student.id === id)
      return foundStudent || null
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

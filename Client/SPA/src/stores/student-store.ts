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
      id: '1030044',
      fullName: 'Иванов Иван Иванович',
      admissionYear: 2020,
      graduationYear: 2024,
      educationLevel: 'Бакалавриат',
      educationStatus: "Закончил обучение",
      departmentId: 1,
      departmentName: 'Программная инженерия',
      facultyName: 'ФИиВТ',
      isArchived: true
    },
    {
      id: '1030045',
      fullName: 'Петрова Анна Сергеевна',
      admissionYear: 2021,
      graduationYear: 2025,
      educationLevel: 'Магистратура',
      educationStatus: 'Отчислен',
      departmentId: 2,
      departmentName: 'Информатика и вычислительная техника',
      facultyName: 'ФИиВТ',
      isArchived: false
    },
    {
      id: '1030046',
      fullName: 'Сидоров Михаил Алексеевич',
      admissionYear: 2019,
      graduationYear: 2023,
      educationLevel: 'Специалитет',
      educationStatus: 'В процессе обучения',
      departmentId: 1,
      departmentName: 'Программная инженерия',
      facultyName: 'ФИиВТ',
      isArchived: true
    },
    {
      id: '1030047',
      fullName: 'Козлова Елена Дмитриевна',
      admissionYear: 2022,
      educationLevel: 'Бакалавриат',
      educationStatus: 'В академ. отпуске',
      departmentId: 3,
      departmentName: 'Прикладная математика',
      facultyName: 'ФИиВТ',
      isArchived: false
    }
  ]


  const mockDepartments = [
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

        // Поиск по тексту
        if (params.search) {
          const searchTerm = params.search.toLowerCase()
          match = match && (
            student.fullName.toLowerCase().includes(searchTerm) ||
            student.id.toLowerCase().includes(searchTerm)
          )
        }

        // Фильтр по кафедре
        if (params.departmentId !== undefined) {
          match = match && student.departmentId === params.departmentId
        }

        // Фильтр по ступени образования
        if (params.educationLevel) {
          match = match && student.educationLevel === params.educationLevel
        }

        // Фильтр по году поступления
        if (params.admissionYear !== undefined) {
          match = match && student.admissionYear == params.admissionYear
        }

        // Фильтр по успешности
        if (params.educationStatus !== undefined) {
          match = match && student.educationStatus == params.educationStatus
        }

        // Фильтр по архивности
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

  const generateStudentId = (): string => {
    const lastId = Math.max(...mockStudents.map(s => {
      const num = parseInt(s.id.replace('ST', ''))
      return isNaN(num) ? 0 : num
    }))
    return `ST${String(lastId + 1).padStart(3, '0')}`
  }

  const createStudent = async (studentData: Omit<Student, 'id' | 'departmentName' | 'facultyName'>): Promise<Student> => {
    try {
      // TODO: Заменить на реальный API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const department = mockDepartments.find(d => d.id === studentData.departmentId)
      const newStudent: Student = {
        ...studentData,
        id: generateStudentId(), // Генерируем уникальный ID
        departmentName: department?.name || 'Неизвестно',
        facultyName: department?.facultyName || 'Неизвестно'
      }

      mockStudents.push(newStudent)
      students.value = [...mockStudents] // Trigger reactivity

      return newStudent
    } catch (error) {
      console.error('Failed to create student:', error)
      throw error
    }
  }

  const updateStudent = async (id: string, studentData: Partial<Omit<Student, 'id' | 'departmentName' | 'facultyName'>>): Promise<Student> => {
    try {
      // TODO: Заменить на реальный API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const studentIndex = mockStudents.findIndex(s => s.id === id)
      if (studentIndex === -1) {
        throw new Error('Студент не найден')
      }

      const department = mockDepartments.find(d => d.id === (studentData.departmentId || mockStudents[studentIndex].departmentId))

      mockStudents[studentIndex] = {
        ...mockStudents[studentIndex],
        ...studentData,
        departmentName: department?.name || mockStudents[studentIndex].departmentName,
        facultyName: department?.facultyName || mockStudents[studentIndex].facultyName
      }

      students.value = [...mockStudents] // Trigger reactivity

      return mockStudents[studentIndex]
    } catch (error) {
      console.error('Failed to update student:', error)
      throw error
    }
  }

  const archiveStudent = async (id: string): Promise<Student> => {
    return updateStudent(id, { isArchived: true })
  }

  const unarchiveStudent = async (id: string): Promise<Student> => {
    return updateStudent(id, { isArchived: false })
  }


  return {
    students,
    loading,
    searchParams,
    fetchStudents,
    getStudentById,
    createStudent,
    updateStudent,
    archiveStudent,
    unarchiveStudent
  }
})

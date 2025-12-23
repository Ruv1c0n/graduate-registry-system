<template>
  <q-card class="student-card" style="padding: 10px;">
    <q-form ref="formRef" @submit="save">
      <!-- Заголовок -->
      <q-card-section class="row items-center">
        <div class="text-h6">
          {{ cardTitle }}
          <q-icon v-if="localEditMode" name="edit" size="18px" class="q-ml-sm" />
        </div>

        <q-space />

        <q-badge color="amber-7" text-color="black" label="АКТИВНАЯ ЗАПИСЬ" v-if="!formData.isArchived" />
        <q-badge color="grey-6" label="АРХИВ" v-else />
      </q-card-section>

      <q-separator />

      <!-- Форма -->
      <q-card-section class="q-gutter-md">
        <div class="row q-col-gutter-md">

          <!-- ФИО (на всю длину) -->
          <div class="col-12">
            <div class="text-caption text-weight-medium q-mb-xs">ФИО студента</div>
            <q-input v-model="formData.fullName" outlined dense :readonly="!localEditMode"
              placeholder="Введите ФИО студента" :rules="[(val) => !!val || 'Обязательное поле']" />
          </div>

          <!-- Номер студенческого билета -->
          <div class="col-12 col-md-6">
            <div class="text-caption text-weight-medium q-mb-xs">Номер студенческого билета</div>
            <q-input v-model="formData.id" outlined dense :readonly="!localEditMode" placeholder="Введите номер"
              :rules="[(val) => !!val || 'Обязательное поле']" mask="#####" unmasked-value />
          </div>

          <!-- Кафедра -->
          <div class="col-12 col-md-6">
            <div class="text-caption text-weight-medium q-mb-xs">Кафедра</div>
            <q-select v-model="formData.departmentId" :options="departmentOptions" outlined dense emit-value map-options
              :readonly="!localEditMode" placeholder="Выберите кафедру"
              :rules="[(val) => !!val || 'Обязательное поле']" />
          </div>

          <!-- Год поступления -->
          <div class="col-12 col-md-6">
            <div class="text-caption text-weight-medium q-mb-xs">Год поступления</div>
            <q-input v-model.number="formData.admissionYear" outlined dense :readonly="!localEditMode" type="number"
              placeholder="Например: 2023" :rules="[
                (val) => !!val || 'Обязательное поле',
                (val) => val > 1900 || 'Некорректный год',
                (val) => val <= new Date().getFullYear() + 5 || 'Год не может быть в будущем'
              ]" />
          </div>

          <!-- Год окончания -->
          <div class="col-12 col-md-6">
            <div class="text-caption text-weight-medium q-mb-xs">Год окончания обучения</div>
            <q-input v-model.number="formData.graduationYear" outlined dense :readonly="!localEditMode" type="number"
              placeholder="Например: 2027" :rules="[
                (val) => !val || val >= formData.admissionYear || 'Год окончания не может быть раньше года поступления'
              ]" />
          </div>

          <!-- Ступень образования -->
          <div class="col-12 col-md-6">
            <div class="text-caption text-weight-medium q-mb-xs">Ступень образования</div>
            <q-select v-model="formData.educationLevel" :options="educationLevels" outlined dense
              :readonly="!localEditMode" placeholder="Выберите ступень"
              :rules="[(val) => !!val || 'Обязательное поле']" />
          </div>

          <!-- Статус завершения -->
          <div class="col-12 col-md-6">
            <div class="text-caption text-weight-medium q-mb-xs">Статус завершения</div>
            <q-select v-model="formData.educationStatus" :options="educationStatusOptions" outlined dense
              :readonly="!localEditMode" placeholder="Выберите статус"
              :rules="[(val) => !!val || 'Обязательное поле']" />
          </div>

          <!-- Факультет (на всю длину) -->
          <div class="col-12">
            <div class="text-caption text-weight-medium q-mb-xs">Факультет</div>
            <q-select v-model="formData.facultyId" :options="facultyOptions" outlined dense emit-value map-options
              :readonly="!localEditMode" placeholder="Выберите факультет"
              :rules="[(val) => !!val || 'Обязательное поле']" />
          </div>

          <!-- Курсовая работа -->
          <div class="col-12">
            <div class="text-caption text-weight-medium q-mb-xs">Курсовая работа</div>
            <div class="row items-center q-col-gutter-md">
              <div class="col">
                <q-input v-model="formData.courseWorkTitle" outlined dense :readonly="!localEditMode"
                  placeholder="Введите тему курсовой работы" />
              </div>
              <div class="col-auto">
                <q-btn v-if="localEditMode" :color="getCourseWorkColor(formData.courseWorkGrade)"
                  :label="courseWorkLabel" @click="showCourseWorkGradeModal" unelevated size="sm" />
                <q-badge v-else :color="getCourseWorkColor(formData.courseWorkGrade)" :label="courseWorkLabel" />
              </div>
            </div>
          </div>

          <!-- Дипломная работа -->
          <div class="col-12">
            <div class="text-caption text-weight-medium q-mb-xs">Дипломная работа</div>
            <div class="row items-center q-col-gutter-md">
              <div class="col">
                <q-input v-model="formData.diplomaWorkTitle" outlined dense :readonly="!localEditMode"
                  placeholder="Введите тему дипломной работы" />
              </div>
              <div class="col-auto">
                <q-btn v-if="localEditMode" :color="getDiplomaWorkColor(formData.diplomaWorkGrade)"
                  :label="diplomaWorkLabel" @click="showDiplomaWorkGradeModal" unelevated size="sm" />
                <q-badge v-else :color="getDiplomaWorkColor(formData.diplomaWorkGrade)" :label="diplomaWorkLabel" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Кнопки -->
      <q-card-actions class="q-pa-md">
        <!-- Кнопка архивации СЛЕВА (только в режиме просмотра и для существующего студента) -->
        <div v-if="!localEditMode" class="q-mr-md">
          <q-btn :label="formData.isArchived ? 'Разархивировать' : 'Архивировать'"
            :color="formData.isArchived ? 'positive' : 'grey-6'" unelevated @click="toggleArchive" />
        </div>

        <q-space />

        <!-- Остальные кнопки СПРАВА -->
        <div class="q-gutter-sm">
          <template v-if="!localEditMode">
            <q-btn label="Закрыть" flat @click="handleCancel" />
            <q-btn label="Редактировать" color="orange" unelevated @click="enableEdit" />
          </template>
          <template v-else>
            <q-btn label="Отмена" flat @click="cancelEdit" />
            <q-btn label="Сохранить" color="orange" unelevated type="submit" :loading="submitting" />
          </template>
        </div>
      </q-card-actions>
    </q-form>

    <!-- Модальное окно для оценки курсовой -->
    <q-dialog v-model="showCourseWorkGradeDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Оценка за курсовую работу</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-gutter-sm">
            <q-radio v-for="grade in courseWorkGrades" :key="grade.value" v-model="selectedCourseWorkGrade"
              :val="grade.value" :label="grade.label" :color="grade.color" />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn flat label="Сохранить" color="primary" @click="saveCourseWorkGrade" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Модальное окно для оценки диплома -->
    <q-dialog v-model="showDiplomaWorkGradeDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Оценка за дипломную работу</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-gutter-sm">
            <q-radio v-for="grade in diplomaWorkGrades" :key="grade.value" v-model="selectedDiplomaWorkGrade"
              :val="grade.value" :label="grade.label" :color="grade.color" />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn flat label="Сохранить" color="primary" @click="saveDiplomaWorkGrade" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useDepartmentStore } from 'src/stores/department-store'
import type { Student, StudentFormData } from 'src/types/students'

interface Props {
  student?: Student | null
  isEditMode?: boolean
}

interface Emits {
  (e: 'create', studentData: StudentFormData): void
  (e: 'update', studentData: StudentFormData): void
  (e: 'cancel'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  student: null,
  isEditMode: false
})

const emit = defineEmits<Emits>()

const departmentStore = useDepartmentStore()
const formRef = ref()
const submitting = ref(false)
const localEditMode = ref(props.isEditMode)

// Модальные окна для оценок
const showCourseWorkGradeDialog = ref(false)
const showDiplomaWorkGradeDialog = ref(false)
const selectedCourseWorkGrade = ref('')
const selectedDiplomaWorkGrade = ref('')

// Данные формы - ВСЕ ПУСТЫЕ ПРИ СОЗДАНИИ НОВОГО СТУДЕНТА
const formData = ref<StudentFormData>({
  id: '',
  fullName: '',
  admissionYear: undefined,
  graduationYear: undefined,
  educationLevel: '',
  educationStatus: '',
  facultyId: 0,
  departmentId: 0,
  isArchived: false,
  courseWorkTitle: '',
  courseWorkGrade: '',
  diplomaWorkTitle: '',
  diplomaWorkGrade: ''
})

// Оценки для курсовой (зачет/незачет)
const courseWorkGrades = [
  { value: 'Зачтено', label: 'Зачтено', color: 'positive' },
  { value: 'Не зачтено', label: 'Не зачтено', color: 'negative' },
  { value: '', label: 'Не оценено', color: 'grey' }
]

// Оценки для диплома
const diplomaWorkGrades = [
  { value: 'Отлично (5)', label: 'Отлично (5)', color: 'positive' },
  { value: 'Хорошо (4)', label: 'Хорошо (4)', color: 'positive' },
  { value: 'Удовлетворительно (3)', label: 'Удовлетворительно (3)', color: 'warning' },
  { value: 'Неудовлетворительно (2)', label: 'Неудовлетворительно (2)', color: 'negative' },
  { value: '', label: 'Не оценено', color: 'grey' }
]

// Опции
const educationLevels = [
  'Бакалавриат', 'Магистратура', 'Специалитет', 'Аспирантура'
]

const educationStatusOptions = [
  'В процессе обучения', 'Закончил обучение', 'Отчислен', 'В академ. отпуске'
]

// Вычисляемые свойства
const facultyOptions = computed(() => {
  const faculties = new Map()
  departmentStore.departments.forEach(dept => {
    if (dept.facultyId && dept.facultyName) {
      faculties.set(dept.facultyId, {
        value: dept.facultyId,
        label: dept.facultyName
      })
    }
  })
  return Array.from(faculties.values())
})

const departmentOptions = computed(() => {
  return departmentStore.departments.map(dept => ({
    value: dept.id,
    label: dept.name
  }))
})

const cardTitle = computed(() => {
  if (props.student?.id) {
    return localEditMode.value ? 'Редактирование студента' : 'Карточка студента'
  }
  return 'Создание нового студента'
})

const courseWorkLabel = computed(() => {
  return formData.value.courseWorkGrade || 'Не оценено'
})

const diplomaWorkLabel = computed(() => {
  return formData.value.diplomaWorkGrade || 'Не оценено'
})

// Методы для цветов оценок
const getCourseWorkColor = (grade: string | undefined) => {
  if (!grade) return 'grey-5'
  return grade === 'Зачтено' ? 'positive' : 'negative'
}

const getDiplomaWorkColor = (grade: string | undefined) => {
  if (!grade) return 'grey-5'
  if (grade.includes('Отлично') || grade.includes('Хорошо')) return 'positive'
  if (grade.includes('Удовлетворительно')) return 'warning'
  return 'negative'
}

// Методы для модальных окон
const showCourseWorkGradeModal = () => {
  selectedCourseWorkGrade.value = formData.value.courseWorkGrade || ''
  showCourseWorkGradeDialog.value = true
}

const showDiplomaWorkGradeModal = () => {
  selectedDiplomaWorkGrade.value = formData.value.diplomaWorkGrade || ''
  showDiplomaWorkGradeDialog.value = true
}

const saveCourseWorkGrade = () => {
  formData.value.courseWorkGrade = selectedCourseWorkGrade.value
  showCourseWorkGradeDialog.value = false
}

const saveDiplomaWorkGrade = () => {
  formData.value.diplomaWorkGrade = selectedDiplomaWorkGrade.value
  showDiplomaWorkGradeDialog.value = false
}

// Метод для архивирования/разархивирования
const toggleArchive = () => {
  formData.value.isArchived = !formData.value.isArchived
  // Сохраняем изменения сразу при переключении
  save()
}

const initForm = () => {
  if (props.student && Object.keys(props.student).length > 0) {
    console.log('initForm: Student data received:', props.student)

    // Берем только те поля, которые точно есть в моках
    formData.value = {
      id: props.student.id || '',
      fullName: props.student.fullName || '',
      admissionYear: props.student.admissionYear,
      graduationYear: props.student.graduationYear,
      educationLevel: props.student.educationLevel || '',
      educationStatus: props.student.educationStatus || '',
      departmentId: props.student.departmentId || 0,
      isArchived: props.student.isArchived || false,
      // Эти поля могут отсутствовать в моках, используем значения по умолчанию
      courseWorkTitle: '',
      courseWorkGrade: '',
      diplomaWorkTitle: '',
      diplomaWorkGrade: ''
    }

    console.log('initForm: Form data initialized:', formData.value)
  } else {
    console.log('initForm: Creating new student (empty form)')
    // Создание нового студента
    formData.value = {
      id: '',
      fullName: '',
      admissionYear: undefined,
      graduationYear: undefined,
      educationLevel: '',
      educationStatus: '',
      departmentId: 0,
      isArchived: false,
      courseWorkTitle: '',
      courseWorkGrade: '',
      diplomaWorkTitle: '',
      diplomaWorkGrade: ''
    }
    localEditMode.value = true
  }
}

const enableEdit = () => {
  localEditMode.value = true
}

const cancelEdit = () => {
  if (props.student) {
    initForm()
    localEditMode.value = false
  } else {
    handleCancel()
  }
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}

const save = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid) return

  submitting.value = true
  try {
    if (props.student?.id) {
      emit('update', { ...formData.value })
    } else {
      emit('create', { ...formData.value })
    }
    localEditMode.value = false
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    submitting.value = false
  }
}

// Инициализация при изменении пропсов
watch(() => props.student, initForm, { immediate: true })

watch(() => props.isEditMode, (newVal) => {
  localEditMode.value = newVal
})

// Загружаем кафедры при создании компонента
onMounted(async () => {
  try {
    await departmentStore.fetchDepartments()
  } catch (error) {
    console.error('Ошибка загрузки кафедр:', error)
  }
})
</script>

<style scoped>
.student-card {
  min-width: 600px;
  max-width: 800px;
  border-radius: 16px;
}
</style>

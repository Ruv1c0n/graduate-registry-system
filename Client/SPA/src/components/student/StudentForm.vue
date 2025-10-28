<template>
  <q-dialog v-model="showDialog" persistent maximized transition-show="slide-up" transition-hide="slide-down">
    <q-card class="full-height">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ isEdit ? 'Редактирование студента' : 'Добавление студента' }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md" ref="formRef">
          <div class="row q-col-gutter-md">
            <!-- Основная информация -->
            <div class="col-12 col-md-6">
              <q-input v-model="formData.fullName" label="ФИО *" :rules="[val => !!val || 'Обязательное поле']" dense
                outlined />

              <q-input v-model="formData.id" label="Номер студенческого билета *"
                :rules="[val => !!val || 'Обязательное поле']" :readonly="isEdit" dense outlined class="q-mt-md" />

              <q-select v-model="formData.educationLevel" :options="educationLevels" label="Ступень образования *"
                :rules="[val => !!val || 'Обязательное поле']" dense outlined class="q-mt-md" />

              <q-input v-model.number="formData.admissionYear" label="Год поступления *" type="number" :rules="[
                val => !!val || 'Обязательное поле',
                val => val >= 2000 && val <= 2030 || 'Год должен быть между 2000 и 2030'
              ]" dense outlined class="q-mt-md" />

              <q-input v-model.number="formData.graduationYear" label="Год окончания" type="number" :rules="[
                val => !val || (val >= 2000 && val <= 2030) || 'Год должен быть между 2000 и 2030'
              ]" dense outlined class="q-mt-md" />
            </div>

            <!-- Кафедра и статусы -->
            <div class="col-12 col-md-6">
              <q-select v-model="formData.departmentId" :options="departmentOptions" option-value="id"
                option-label="name" emit-value map-options label="Кафедра *"
                :rules="[val => !!val || 'Обязательное поле']" dense outlined />

              <q-toggle v-model="formData.isSuccess" label="Успешно завершил обучение" class="q-mt-md" />

              <q-toggle v-model="formData.isArchived" label="Архивная запись" class="q-mt-md" />

              <!-- Информация об архивности -->
              <div v-if="isEdit && originalStudent?.isArchived" class="q-mt-md">
                <q-banner class="bg-orange-1 text-orange-8">
                  <template #avatar>
                    <q-icon name="archive" />
                  </template>
                  Это архивная запись. Редактирование ограничено.
                </q-banner>
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="row q-mt-lg">
            <q-space />
            <q-btn label="Отмена" type="reset" color="grey" v-close-popup class="q-mr-md" />
            <q-btn :label="isEdit ? 'Сохранить' : 'Создать'" type="submit" color="primary" :loading="submitting" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useDepartmentStore } from 'src/stores/department-store'
import type { Student } from 'src/types/students'

interface Props {
  modelValue: boolean
  student?: Student | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', student: Omit<Student, 'departmentName' | 'facultyName'>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const departmentStore = useDepartmentStore()
const formRef = ref()
const submitting = ref(false)
const originalStudent = ref<Student | null>(null)

// Данные формы
const formData = ref({
  id: '',
  fullName: '',
  admissionYear: new Date().getFullYear(),
  graduationYear: undefined as number | undefined,
  educationLevel: 'Бакалавриат',
  isSuccess: false,
  departmentId: 0,
  isArchived: false
})

// Опции
const educationLevels = [
  'Бакалавриат', 'Магистратура', 'Специалитет', 'Аспирантура'
]

const departmentOptions = computed(() =>
  departmentStore.departments.map(dept => ({
    id: dept.id,
    name: dept.name
  }))
)

// Вычисляемые свойства
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEdit = computed(() => !!props.student)

// Методы
const onSubmit = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  submitting.value = true
  try {
    emit('submit', {
      ...formData.value,
      graduationYear: formData.value.graduationYear || undefined
    })
    showDialog.value = false
  } catch (error) {
    console.error('Ошибка сохранения студента:', error)
  } finally {
    submitting.value = false
  }
}

const onReset = () => {
  formData.value = {
    id: '',
    fullName: '',
    admissionYear: new Date().getFullYear(),
    graduationYear: undefined,
    educationLevel: 'Бакалавриат',
    isSuccess: false,
    departmentId: 0,
    isArchived: false
  }
}

const initForm = () => {
  if (props.student) {
    // Редактирование существующего студента
    originalStudent.value = props.student
    formData.value = {
      id: props.student.id,
      fullName: props.student.fullName,
      admissionYear: props.student.admissionYear,
      graduationYear: props.student.graduationYear,
      educationLevel: props.student.educationLevel,
      isSuccess: props.student.isSuccess,
      departmentId: props.student.departmentId,
      isArchived: props.student.isArchived
    }
  } else {
    // Создание нового студента
    onReset()
  }
}

// Инициализация формы при открытии диалога
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    initForm()
  }
})

// Загружаем кафедры при создании компонента - исправляем floating promise
onMounted(() => {
  void departmentStore.fetchDepartments()
})
</script>

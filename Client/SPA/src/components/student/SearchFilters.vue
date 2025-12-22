<template>
  <div class="search-filters q-pa-md">
    <!-- Основная строка поиска -->
    <div class="row items-center">
      <!-- Поле поиска -->
      <q-input v-model="localSearch" placeholder="Поиск по ФИО или номеру билета..." dense outlined clearable
        class="col-grow" @update:model-value="onSearchChange" @clear="onSearchClear">
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Кнопка расширенных фильтров -->
      <q-btn flat :icon="showAdvancedFilters ? 'expand_less' : 'expand_more'"
        :label="showAdvancedFilters ? 'Скрыть фильтры' : 'Фильтры'"
        @click="showAdvancedFilters = !showAdvancedFilters" />
    </div>

    <!-- Расширенные фильтры -->
    <div v-if="showAdvancedFilters" class="advanced-filters row q-col-gutter-sm">
      <!-- Фильтр по кафедре -->
      <q-select v-model="localDepartmentId" :options="departmentOptions" option-value="id" option-label="name"
        emit-value map-options label="Кафедра" dense outlined class="col-12 col-sm-6 col-md-4"
        @update:model-value="onFiltersChange" />

      <!-- Фильтр по ступени образования -->
      <q-select v-model="localEducationLevel" :options="educationLevels" label="Ступень образования" dense outlined
        emit-value class="col-12 col-sm-6 col-md-4" @update:model-value="onFiltersChange" />

      <!-- Фильтр по статусу -->
      <q-select v-model="localIsArchived" :options="statusOptions" label="Статус" dense outlined emit-value
        option-value="value" option-label="label" class="col-12 col-sm-6 col-md-4" @update:model-value="onFiltersChange" />

      <q-select v-model="localEducationStatus" :options="educationStatus" label="Успешность" dense outlined emit-value
        class="col-12 col-sm-6 col-md-4" @update:model-value="onFiltersChange"></q-select>

      <q-select v-model="localAdmissionYear" :options="admissionYear" label="Год поступления" dense outlined emit-value
        class="col-12 col-sm-6 col-md-4" @update:model-value="onFiltersChange"></q-select>
    </div>

    <!-- Сброс фильтров -->
    <div v-if="hasActiveFilters" class="row items-center q-mt-sm">
      <q-btn flat dense icon="clear_all" label="Сбросить фильтры" color="negative" @click="resetFilters" />
      <q-space />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDepartmentStore } from 'src/stores/department-store'
import type { StudentSearchParams } from 'src/types/students'

interface Props {
  searchParams?: StudentSearchParams
}

interface Emits {
  (e: 'search', params: StudentSearchParams): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const departmentStore = useDepartmentStore()

// Локальные состояния
const localSearch = ref('')
const localDepartmentId = ref<number | undefined>()
const localEducationLevel = ref('')
const localIsArchived = ref<boolean | undefined>()
const localEducationStatus = ref<string | undefined>()
const localAdmissionYear = ref<number | undefined>()
const showAdvancedFilters = ref(false)

// Опции для селектов
const educationLevels = [
  { label: 'Бакалавриат', value: 'Бакалавриат' },
  { label: 'Магистратура', value: 'Магистратура' },
  { label: 'Специалитет', value: 'Специалитет' },
  { label: 'Аспирантура', value: 'Аспирантура' }
]

const statusOptions = [
  { label: 'Активные', value: false },
  { label: 'Архивные', value: true }
]

const educationStatus = [
  { label: 'Закончил обучение', value: 'Закончил обучение' },
  { label: 'В процессе обучения', value: 'В процессе обучения' },
  { label: 'Отчислен', value: 'Отчислен' },
  { label: 'В академ. отпуске', value: 'В академ. отпуске' }
]

const admissionYear = [2019, 2020, 2021, 2022, 2023, 2024, 2025]

const departmentOptions = computed(() =>
  departmentStore.departments.map(dept => ({
    id: dept.id,
    name: dept.name
  }))
)

// Вычисляемые свойства
const hasActiveFilters = computed(() =>
  Boolean(
    localSearch.value ||
    localDepartmentId.value !== undefined ||
    localEducationLevel.value !== '' ||
    localIsArchived.value !== undefined ||
    localEducationStatus.value ||
    localAdmissionYear.value
  )
)

// Методы
const onSearchChange = (value: string | number | null) => {
  localSearch.value = (value as string) || ''
  debouncedSearch()
}

const onSearchClear = () => {
  localSearch.value = ''
  debouncedSearch()
}

const onFiltersChange = () => {
  emitSearchParams()
}

const resetFilters = () => {
  localSearch.value = ''
  localDepartmentId.value = undefined
  localEducationLevel.value = ''
  localIsArchived.value = undefined
  localEducationStatus.value = undefined
  localAdmissionYear.value = undefined
  emitSearchParams()
}

const emitSearchParams = () => {
  const params: StudentSearchParams = {
    search: localSearch.value || undefined,
    departmentId: localDepartmentId.value,
    educationLevel: localEducationLevel.value || undefined,
    isArchived: localIsArchived.value === null ? undefined : localIsArchived.value,
    educationStatus: localEducationStatus.value || undefined,
    admissionYear: localAdmissionYear.value
  }

  emit('search', params)
}

// Дебаунс для поиска
let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emitSearchParams()
  }, 500)
}

// Инициализация из props
watch(
  () => props.searchParams,
  (newParams) => {
    if (newParams) {
      localSearch.value = newParams.search || ''
      localDepartmentId.value = newParams.departmentId
      localEducationLevel.value = newParams.educationLevel || ''
      localIsArchived.value = newParams.isArchived
      localEducationStatus.value = newParams.educationStatus || ''
      localAdmissionYear.value = newParams.admissionYear
    }
  },
  { immediate: true }
)

watch(localIsArchived, (val) => {
  console.log('localIsArchived:', val)
})

// Загружаем кафедры при монтировании
onMounted(async () => {
  try {
    await departmentStore.fetchDepartments()
  } catch (error) {
    console.error('Ошибка загрузки кафедр:', error)
  }
})
</script>

<style lang="scss" scoped>
.search-filters {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
}

.advanced-filters {
  border-top: 1px solid #e9ecef;
  margin-top: 8px;
}
</style>

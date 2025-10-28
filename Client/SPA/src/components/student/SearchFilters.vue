<template>
  <div class="search-filters q-pa-md q-gutter-md">
    <!-- Основная строка поиска -->
    <div class="row items-center q-gutter-md">
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
    <div v-if="showAdvancedFilters" class="advanced-filters row q-gutter-md">
      <!-- Фильтр по кафедре -->
      <q-select v-model="localDepartmentId" :options="departmentOptions" option-value="id" option-label="name"
        emit-value map-options label="Кафедра" dense outlined clearable class="col-12 col-sm-6 col-md-4"
        @update:model-value="onFiltersChange" />

      <!-- Фильтр по ступени образования -->
      <q-select v-model="localEducationLevel" :options="educationLevels" label="Ступень образования" dense outlined
        clearable class="col-12 col-sm-6 col-md-4" @update:model-value="onFiltersChange" />

      <!-- Фильтр по статусу -->
      <q-select v-model="localIsArchived" :options="statusOptions" label="Статус" dense outlined clearable
        class="col-12 col-sm-6 col-md-4" @update:model-value="onFiltersChange" />
    </div>

    <!-- Сброс фильтров -->
    <div v-if="hasActiveFilters" class="row items-center q-mt-sm">
      <q-btn flat dense icon="clear_all" label="Сбросить фильтры" color="negative" @click="resetFilters" />
      <q-space />
      <div class="text-caption text-grey">
        Активные фильтры: {{ activeFiltersCount }}
      </div>
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

const departmentOptions = computed(() =>
  departmentStore.departments.map(dept => ({
    id: dept.id,
    name: dept.name
  }))
)

// Вычисляемые свойства
const hasActiveFilters = computed(() => {
  return localSearch.value !== '' ||
    localDepartmentId.value !== undefined ||
    localEducationLevel.value !== '' ||
    localIsArchived.value !== undefined
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (localSearch.value) count++
  if (localDepartmentId.value !== undefined) count++
  if (localEducationLevel.value) count++
  if (localIsArchived.value !== undefined) count++
  return count
})

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
  emitSearchParams()
}

const emitSearchParams = () => {
  const params: StudentSearchParams = {
    search: localSearch.value || undefined,
    departmentId: localDepartmentId.value,
    educationLevel: localEducationLevel.value || undefined,
    isArchived: localIsArchived.value
  }
  emit('search', params)
}

// Дебаунс для поиска
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emitSearchParams()
  }, 500)
}

// Инициализация из props
watch(() => props.searchParams, (newParams) => {
  if (newParams) {
    localSearch.value = newParams.search || ''
    localDepartmentId.value = newParams.departmentId
    localEducationLevel.value = newParams.educationLevel || ''
    localIsArchived.value = newParams.isArchived
  }
}, { immediate: true })

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
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.advanced-filters {
  border-top: 1px solid #e9ecef;
  padding-top: 16px;
}
</style>

<template>
  <div>
    <!-- Временная отладочная информация -->
    <div class="q-pa-md bg-yellow-2 text-grey-8">
      <div class="text-caption">Отладка: {{ students.length }} студентов</div>
      <div v-for="student in students" :key="student.id" class="text-caption">
        {{ student.id }}: {{ student.fullName }}
      </div>
    </div>

    <q-table :rows="students" :columns="columns" :loading="loading" row-key="id" :pagination="pagination"
      @row-click="onRowClick" class="student-table q-mt-md" flat bordered>
      <!-- Кастомный заголовок -->
      <template #top>
        <div class="row items-center full-width">
          <div class="text-h6">Список студентов</div>
          <q-space />
          <div class="text-caption text-grey">
            Всего: {{ students.length }} записей
          </div>
        </div>
      </template>

      <!-- Кастомная ячейка для статуса архивности -->
      <template #body-cell-isArchived="props">
        <q-td :props="props">
          <q-badge :color="props.value ? 'grey' : 'positive'" :label="props.value ? 'Архив' : 'Активен'" />
        </q-td>
      </template>

      <!-- Кастомная ячейка для успешности обучения -->
      <template #body-cell-isSuccess="props">
        <q-td :props="props">
          <q-icon :name="props.value ? 'check_circle' : 'cancel'" :color="props.value ? 'positive' : 'negative'"
            size="1.5em" />
        </q-td>
      </template>

      <!-- Кастомная ячейка для действий -->
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="visibility" color="primary" @click.stop="onViewStudent(props.row)">
            <q-tooltip>Просмотреть карточку</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <!-- Состояние загрузки -->
      <template #loading>
        <q-inner-loading showing color="primary" />
      </template>

      <!-- Состояние пустых данных -->
      <template #no-data>
        <div class="full-width row flex-center text-grey q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span>Нет данных для отображения</span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import type { QTableProps } from 'quasar'
import type { Student } from 'src/types/students'

interface Props {
  students: Student[]
  loading: boolean
  filter?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'row-click', student: Student): void
  (e: 'view-student', student: Student): void
}>()

// Колонки таблицы - убедимся что field соответствует свойствам Student
const columns: QTableProps['columns'] = [
  {
    name: 'fullName',
    label: 'ФИО',
    field: 'fullName', // Должно совпадать с Student.fullName
    align: 'left',
    sortable: true,
    classes: 'text-weight-medium'
  },
  {
    name: 'id',
    label: 'Номер билета',
    field: 'id', // Должно совпадать с Student.id
    align: 'left',
    sortable: true,
    style: 'width: 150px;'
  },
  {
    name: 'educationLevel',
    label: 'Ступень образования',
    field: 'educationLevel', // Должно совпадать с Student.educationLevel
    align: 'center',
    sortable: true,
    style: 'width: 180px;'
  },
  {
    name: 'departmentName',
    label: 'Кафедра',
    field: 'departmentName', // Должно совпадать с Student.departmentName
    align: 'left',
    sortable: true
  },
  {
    name: 'admissionYear',
    label: 'Год поступления',
    field: 'admissionYear', // Должно совпадать с Student.admissionYear
    align: 'center',
    sortable: true,
    style: 'width: 150px;'
  },
  {
    name: 'isSuccess',
    label: 'Успешность',
    field: 'isSuccess', // Должно совпадать с Student.isSuccess
    align: 'center',
    sortable: true,
    style: 'width: 120px;'
  },
  {
    name: 'isArchived',
    label: 'Статус',
    field: 'isArchived', // Должно совпадать с Student.isArchived
    align: 'center',
    sortable: true,
    style: 'width: 100px;'
  },
  {
    name: 'actions',
    label: 'Действия',
    field: '', // Пустое поле для колонки действий
    align: 'center',
    sortable: false,
    style: 'width: 80px;'
  }
]

// Пагинация
const pagination = {
  sortBy: 'fullName' as const,
  descending: false,
  page: 1,
  rowsPerPage: 25
}

// Обработчики событий
const onRowClick = (evt: Event, row: Student) => {
  emit('row-click', row)
}

const onViewStudent = (student: Student) => {
  emit('view-student', student)
}
</script>

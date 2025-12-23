<template>
  <div>

    <q-table hide-pagination :rows="students" :columns="columns" :loading="loading" row-key="id" :pagination="pagination"
    class="student-table q-mt-md" flat bordered>

      <!-- Кастомная ячейка для статуса архивности -->
      <template #body-cell-isArchived="props">
        <q-td :props="props">
          <q-badge
          :style="{
            backgroundColor: props.value ? '#F1F5F9' : '#DCFCE7',
            color: props.value ? '#475569' : '#166534'
          }"
          :label="props.value ? 'Архив' : 'Активен'" />
        </q-td>
      </template>

      <!-- Кастомная ячейка для успешности обучения -->
      <template #body-cell-educationStatus="props">
        <q-td :props="props">
          <q-icon
          :name="getEducationStatusIcon(props.value)"
          :color="getEducationStatusColor(props.value)"
          size="1.5em"
          />
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
  (e: 'view-student', student: Student): void
}>()

const getEducationStatusIcon = (status: string) => {
  if (status === 'Закончил обучение') return 'check_circle'
  if (status === 'Отчислен') return 'cancel'
  return 'access_time' // остальные статусы
}

const getEducationStatusColor = (status: string) => {
  if (status === 'Закончил обучение') return 'positive'
  if (status === 'Отчислен') return 'negative'
  return 'warning'
}

const columns: QTableProps['columns'] = [
  {
    name: 'fullName',
    label: 'ФИО',
    field: 'fullName',
    align: 'left',
    sortable: true,
    classes: 'text-weight-medium'
  },
  {
    name: 'id',
    label: 'Номер билета',
    field: 'id',
    align: 'left',
    sortable: true,
    style: 'width: 150px;'
  },
  {
    name: 'educationLevel',
    label: 'Ступень образования',
    field: 'educationLevel',
    align: 'center',
    sortable: true,
    style: 'width: 180px;'
  },
  {
    name: 'departmentName',
    label: 'Кафедра',
    field: 'departmentName',
    align: 'left',
    sortable: true
  },
  {
    name: 'admissionYear',
    label: 'Год поступления',
    field: 'admissionYear',
    align: 'center',
    sortable: true,
    style: 'width: 150px;'
  },
  {
    name: 'educationStatus',
    label: 'Успешность',
    field: 'educationStatus',
    align: 'center',
    sortable: true,
    style: 'width: 120px;'
  },
  {
    name: 'isArchived',
    label: 'Статус',
    field: 'isArchived',
    align: 'center',
    sortable: true,
    style: 'width: 100px;'
  },
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
    style: 'width: 80px;'
  }
]

const pagination = {
  sortBy: 'fullName' as const,
  descending: false,
  page: 1,
  rowsPerPage: 25
}


const onViewStudent = (student: Student) => {
  console.log('Table: View student clicked', student)

  if (!student || Object.keys(student).length === 0) {
    console.error('Student object is empty!')
    return
  }

  emit('view-student', student)
}
</script>

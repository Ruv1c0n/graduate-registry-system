import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Будь осторожен при использовании SSR
const api = axios.create({
  baseURL: process.env.DEV ? '/api' : 'http://localhost:8080/api',
  timeout: 10000
});

// Функция для обработки ошибок
const handleApiError = (error: any, router: any) => {
  const errorMessage = error.response?.data?.message || error.message || '';
  const lowerMessage = errorMessage.toLowerCase();

  // Проверяем текст ошибки и перенаправляем на соответствующую страницу
  if (lowerMessage.includes('уже зарегистрирован') || lowerMessage.includes('дубликат')) {
    router.push('/save-error');
  }
  else if (lowerMessage.includes('не найден') || lowerMessage.includes('не существует')) {
    router.push('/not-found-error');
  }
  else if (
    lowerMessage.includes('баз данных') ||
    lowerMessage.includes('postgresql') ||
    lowerMessage.includes('соединен') ||
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNABORTED'
  ) {
    router.push('/database-error');
  }
};

export default defineBoot(({ app, router }) => {
  // Для использования внутри Vue файлов (Options API) через this.$axios и this.$api
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  // Перехватчик для основного axios (все запросы)
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      handleApiError(error, router);
      return Promise.reject(error);
    }
  );

  // Перехватчик для нашего API
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      handleApiError(error, router);
      return Promise.reject(error);
    }
  );
});

export { axios, api };

// Russian localization strings for the FSP‑2026 UI
// Exported as a plain object; can be extended for other locales.
export const ru = {
  // Common
  ok: 'ОК',
  cancel: 'Отмена',
  close: 'Закрыть',

  // Toast messages
  toastBackendConnected: 'Подключение к Spring Boot 3 Backend API успешно установлено! Данные синхронизированы с PostgreSQL.',
  toastOAuthSuccess: 'Успешная авторизация через GitHub OAuth! Профиль и ELO верифицированы.',
  toastOAuthGitHubSuccess: 'Успешная авторизация через GitHub OAuth! Профиль и ELO верифицированы.',
  toastOAuthGithubConnected: 'GitHub OAuth успешно подключён.',
  toastOfferSent: 'Оффер с окладом {salary} ₽ успешно отправлен соискателю {candidate}.',
  toastOfferDuplicate: 'Оффер уже был отправлен ранее соискателю {candidate}.',

  // Modals / UI placeholders
  auditLogTitle: 'Журнал действий',
  auditLogEmpty: 'Записей нет',
  privacyModalTitle: 'Политика конфиденциальности',
  privacyModalContent: 'Текст политики будет добавлен позже.',
  leetCodeImportPlaceholder: 'Введите URL задачи LeetCode',
  resumeParserPlaceholder: 'Перетащите PDF резюме сюда',
  vacancyCreateTitle: 'Создание вакансии',
  vacancyCreatePlaceholder: 'Введите название вакансии',

  // Forms
  formSubmit: 'Отправить',
  formCancel: 'Отмена',
};

/**
 * Simple translation function for the Russian locale.
 * For now it returns the string from the `ru` map; supports basic interpolation.
 * @param key – key from the `ru` object
 * @param params – optional interpolation parameters
 */
export function t(key: keyof typeof ru, params?: Record<string, string | number>) {
  let result = ru[key] as string;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      result = result.replace(`{${k}}`, String(v));
    }
  }
  return result;
}

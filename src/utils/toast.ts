// Utility for toast notifications with i18n support
import { t } from '@/i18n/ru';

export type ToastType = 'success' | 'info' | 'fsp';

/**
 * Show a toast message using a localization key.
 * @param key - key from the Russian i18n dictionary
 * @param params - optional interpolation parameters
 * @param type - toast style (default "info")
 */
export function showToastI18n(
  key: keyof typeof import('@/i18n/ru').ru,
  params?: Record<string, string | number>,
  type: ToastType = 'info'
) {
  // The original showToast implementation lives in App.tsx; we import it lazily.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { showToast } = require('../App');
  const message = t(key, params);
  showToast(message, type);
}

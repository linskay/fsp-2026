// Centralized TypeScript types for form states used across the app

/**
 * Form values for the LeetCode import modal.
 */
export interface LeetCodeImportForm {
  searchQuery: string;
  customSlug: string;
  isLoading: boolean;
  graphQlLog: string;
  selectedPresetSlug: string | null;
}

/**
 * Form values for creating a vacancy.
 */
export interface VacancyForm {
  title: string;
  salaryMin: number;
  salaryMax: number;
  description?: string;
}

/**
 * Generic login form.
 */
export interface LoginForm {
  email: string;
  password: string;
}

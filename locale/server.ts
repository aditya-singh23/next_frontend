import { en } from './en';

export const translations = {
  en,
};

export type Locale = keyof typeof translations;

export async function getTranslations(locale: Locale = 'en') {
  return translations[locale] || translations.en;
}

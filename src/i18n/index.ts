import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from './en';
import fr from './fr';

const i18n = new I18n({ en, fr });
i18n.defaultLocale = 'en';
i18n.locale = (Localization as any)?.locale?.split?.('-')?.[0] ?? 'en';
i18n.enableFallback = true;

export const t = (key: string, options?: Parameters<I18n['t']>[1]) => i18n.t(key, options);
export const setLocale = (locale: 'en' | 'fr') => { i18n.locale = locale; };

export default i18n;



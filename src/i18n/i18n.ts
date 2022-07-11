import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import cn from './zh-CN.json';
import en from './en-US.json';

export enum LanguageType {
  ZH_CN = 'zh-CN',
  EN_US = 'en-US',
}

export const resources = {
  [LanguageType.ZH_CN]: {
    translation: cn,
  },
  [LanguageType.EN_US]: {
    translation: en,
  },
} as const;

let language = LanguageType.EN_US;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: language,
    debug: true
});

export default i18n;
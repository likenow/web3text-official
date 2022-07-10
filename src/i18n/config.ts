import i18n from 'i18next';
import ns1 from './en/ns1.json';
import ns2 from './en/ns2.json';
import zns1 from './zh/ns1.json';
import zns2 from './zh/ns2.json';

import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    ns1,
    ns2,
  },
  zh: {
    zns1,
    zns2,
  }
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['ns1', 'ns2'],
  resources,
});
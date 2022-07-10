// import the original type declarations
import 'react-i18next';
// import all namespaces (for the default language, only)
import { resources } from 'i18n/config';

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  type DefaultResources = typeof resources['en'];
  interface Resources extends DefaultResources {}
};
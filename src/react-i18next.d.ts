// https://react.i18next.com/latest/typescript
// import the original type declarations
import { resources, LanguageType } from './i18n/i18n';

type I18nStoreType = typeof import('./i18n/en-US.json');

export type I18nT = {
  (key: keyof I18nStoreType): string;
};

declare module 'i18next' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TFunction extends I18nT {}
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: typeof resources[LanguageType.EN_US];
  }
}
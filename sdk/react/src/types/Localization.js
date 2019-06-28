// @flow

export type Localization = {
  defaultLanguage: string,
  [string]: { // locale
    [string]: string, // stringId -> localization
  },
};

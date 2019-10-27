import { noop } from '@ch1/utility';
import { Translations } from '../interfaces';
import { createEventEmitter } from '../event';

const storageId = 'language';
if (!window.localStorage) {
  (window as any).localStorage = {
    getItem: noop,
    setItem: noop,
  };
}

export const initialLanguage = window.localStorage.getItem(storageId) || 'en';

export const languages = ['ar', 'en', 'es', 'fr', 'he', 'hi', 'pt', 'ru', 'zh'];

function saveLanguage(languageCode: string) {
  window.localStorage.setItem(storageId, languageCode);
}

function getLanguage(translations: Translations, languageCode: string) {
  if (translations.languageCode) {
    return Promise.resolve(translations[languageCode]);
  }

  return import('./' + languageCode)
    .then(mod => {
      translations[languageCode] = mod.language;
      return mod.language;
    })
    .catch((e: Error) => {
      throw e;
    });
}

function setLanguage(translations: Translations, code: string) {
  return getLanguage(translations, code).then(() => {
    saveLanguage(code);
  });
}

export function createLanguageState() {
  const emitter = createEventEmitter();
  const loaded: Translations = {};
  let current = initialLanguage;

  const set = (languageCode: string = initialLanguage) => {
    setLanguage(loaded, languageCode)
      .then(() => {
        current = languageCode;
        emitter.emit('update', loaded[languageCode]);
      })
      .catch((e: Error) => {
        throw e;
      });
  };

  return {
    currentCode: () => current,
    current: () => loaded[current] || {},
    on: (callback: (...args: any[]) => void) => emitter.on('update', callback),
    set,
  };
}

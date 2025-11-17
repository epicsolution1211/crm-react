import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './translations/en';
import { de } from './translations/de';
import { es } from "./translations/es";
import { ru } from "./translations/ru";
import { it } from "./translations/it"; 
import { nl } from "./translations/nl";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      ru: { translation: ru },
      it: { translation: it },
      nl: { translation: nl },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

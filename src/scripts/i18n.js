import { register, init } from 'svelte-i18n';

function registerLocales(locales) {
  locales.forEach((locale) => {
    register(locale, () => importLocale(locale));
  });
}

function importLocale(locale) {
  return import(`../locales/translations_${locale}.json`);
}

export async function internationalize(locales) {

  const defaultLocale = locales[0];
  // Asynchronous loading

  // WE WANT TO USE THIS!!! 🤬
  // It is an important step in making locale additions fully automagical!
  // For this to work rollup-plugin dynamic import vars needs to work...
  // await registerLocales(locales);

  // Keep using this until above works... 😭
  register('en', () => import('../locales/translations_en.json'));
  register('nl', () => import('../locales/translations_nl.json'));
  register('fr', () => import('../locales/translations_fr.json'));
  register('de', () => import('../locales/translations_de.json'));

  init({
    fallbackLocale: defaultLocale,
    // language[-region]
    // e.g. /nl-NL/ --> Dutch Netherlands
    // See https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes for language codes
    // See https://en.wikipedia.org/wiki/ISO_3166-1 for region codes
    // initialLocale: getLocaleFromPathname(/^\/([a-z]{2})(\-[A-Z]{2})?\//)
    initialLocale: defaultLocale
  });
}

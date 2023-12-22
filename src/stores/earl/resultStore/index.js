import { derived } from 'svelte/store';

import { locale, t as translate } from 'svelte-i18n';

import { OUTCOME, IMPACT } from './models.js';

const _outcomeValues = Object.keys(OUTCOME).map((key) => {
  return {
    ...OUTCOME[key],
    key,
    title: '',
    locales: {}
  };
});

export function isUntestedOutcome(outcome = {}) {
  if (!outcome) {
    throw new Error(
      '[isUntestedOutcome]: Expected argument, outcome, to be defined.'
    );
  }

  return outcome.id === OUTCOME.UNTESTED.id;
}

export const outcomeValueStore = derived(
  [locale, translate],
  ([$locale, $translate]) => {
    // add translations to locales property like:
    // {
    //  [locale]: {
    //    title: translation,
    //  }
    // }
    // Then set title to locales.locale.title
    _outcomeValues.forEach((_outcomeValue) => {
      if (!_outcomeValue.locales[$locale]) {
        _outcomeValue.locales[$locale] = {
          title: $translate(`UI.EARL.${_outcomeValue.key}`)
        };
      }

      _outcomeValue.title = _outcomeValue.locales[$locale].title;
    });

    return _outcomeValues;
  },
  _outcomeValues
);

const _impactValues = Object.keys(IMPACT).map((key) => {
  return {
    ...IMPACT[key],
    key,
    title: '',
    locales: {}
  };
});

export function isUntestedImpact(impact = {}) {
  if (!impact) {
    throw new Error(
      '[isUntestedImpact]: Expected argument, impact, to be defined.'
    );
  }

  return impact.id === IMPACT.UNTESTED.id;
}

export const impactValueStore = derived(
  [locale, translate],
  ([$locale, $translate]) => {
    // add translations to locales property like:
    // {
    //  [locale]: {
    //    title: translation,
    //  }
    // }
    // Then set title to locales.locale.title
    _impactValues.forEach((_impactValue) => {
      if (!_impactValue.locales[$locale]) {
        _impactValue.locales[$locale] = {
          title: $translate(`UI.EARL.${_impactValue.key}`)
        };
      }

      _impactValue.title = _impactValue.locales[$locale].title;
    });

    return _impactValues;
  },
  _impactValues
);

export { OUTCOME, IMPACT };

export default {};

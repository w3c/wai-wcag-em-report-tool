import { derived } from 'svelte/store';

import scopeStore from '@app/stores/scopeStore.js';
import wcagCriteriaData from '@app/data/wcag.json';

export const CONFORMANCE_LEVELS = ['A', 'AA', 'AAA'];
export const DEFAULT_CONFORMANCE_LEVEL = 'AA';

export const WCAG_VERSIONS = Object.keys(wcagCriteriaData);
export const DEFAULT_WCAG_VERSION = WCAG_VERSIONS.slice(-1)[0];

export const scopedWcagVersions = derived([scopeStore], ([$scopeStore]) => {
  const { WCAG_VERSION, CONFOMANCE_TARGET } = $scopeStore;

  return WCAG_VERSIONS.filter((version) => {
    return version <= WCAG_VERSION;
  });
});

// Initially create full wcag data dictionary per version
// Starts with 2.0 ends with latest 2.X version
export const wcagCriteriaDictionary = WCAG_VERSIONS.reduce((result, version, index) => {
  const versionedCriteria = [];
  const previousVersion = result[index - 1];
  let criterion;

  for (criterion in wcagCriteriaData[version]) {
    versionedCriteria.push({
      ...wcagCriteriaData[version][criterion],
      version
    });
  }

  // Add previous version to the current
  // and downgrade version if existing
  if (previousVersion) {
    previousVersion.criteria.forEach((previousCriterion) => {
      const changedCriterion = versionedCriteria.find((criterion) => {
        return criterion.num === previousCriterion.num;
      });
      if (changedCriterion) {
        changedCriterion.version = previousCriterion.version;
      }
    });
  }

  // Sort criteria by numbering
  // num === principle.guideline.criterion
  versionedCriteria.sort((a, b) => {
    const [ap, ag, ac] = a.num.split('.').map((str) => parseInt(str, 10));
    const [bp, bg, bc] = b.num.split('.').map((str) => parseInt(str, 10));

    if (ap > bp) {
      return 1;
    }

    if (ap < bp) {
      return -1;
    }

    if (ag > bg) {
      return 1;
    }

    if (ag < bg) {
      return -1;
    }

    if (ac > bc) {
      return 1;
    }

    if (ac < bc) {
      return -1;
    }

    return -1;
  });

  console.log(versionedCriteria);

  result.push({
    version,
    criteria: [...versionedCriteria]
  });

  // Last version added, return dictionary like:
  // {
  //  "2.0": [...criteria],
  //  [version]: [...criteria]
  //  ...
  // }
  if (index === WCAG_VERSIONS.length - 1) {
    return result.reduce((wcagDictionary, wcag) => {
      const {version, criteria} = wcag;

      wcagDictionary[version] = [...criteria];

      return wcagDictionary;
    }, {});
  }

  return result;
}, []);

const _allCriteria = WCAG_VERSIONS.reduce((allCriteria, version) => {
  return [...allCriteria, ...wcagCriteriaDictionary[version]];
}, []);

export function getCriterionById(id) {
  return _allCriteria.find((_criterion) => {
    return _criterion.id === id;
  });
}

/**
 * wcagCriteriaStore
 * Store that returns all criteria data,
 * derived from current WCAG_VERSION.
 * @type {derived}
 * @return {Array[Object]}  - Array of criterion objects
 */
export const wcag = derived([scopeStore], ([$scopeStore]) => {
  const wcagVersion = $scopeStore['WCAG_VERSION'];

  return wcagCriteriaDictionary[wcagVersion];
});

export default wcag;

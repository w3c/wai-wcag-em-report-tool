import collection from '@app/stores/collectionStore.js';
import {
  wcagCriteriaDictionary,
  WCAG_VERSIONS
} from '@app/stores/wcagStore.js';

import { TestRequirement } from './models.js';

/**
 * initialTestStore
 *
 * Set initial tests with latest wcag criteria.
 * Add num(bering) property for internal matching.
 * @type {Array}
 */
const LATEST_WCAG_VERSION = WCAG_VERSIONS.slice(-1)[0];
console.log('LATEST_WCAG_VERSION', LATEST_WCAG_VERSION);
console.log('wcagCriteriaDictionary', wcagCriteriaDictionary);
let initialTestStore = [];
for (const property in wcagCriteriaDictionary) {
  let temp = wcagCriteriaDictionary[property].map((criterion) => {
    const newTest = new TestRequirement(criterion);
    const wcagVersionLd = `WCAG${property.replace('.', '')}`;
    newTest.id = `${wcagVersionLd}:${criterion.id}`;
    newTest.num = criterion.num;
    newTest.conformanceLevel = criterion.conformanceLevel;

    return newTest;
  });

  temp.forEach((t) => {
    initialTestStore.push(t);
  });
}
console.log('initialTestStore', initialTestStore);

/**
 * $tests
 *
 * Set of earl.TestCriterion,
 * - TestRequirement
 *
 * @type {Array[TestCriterion]}
 */
const $tests = collection(TestRequirement, initialTestStore);

export default $tests;

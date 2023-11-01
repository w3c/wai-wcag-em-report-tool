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
console.log(LATEST_WCAG_VERSION);
console.log(wcagCriteriaDictionary);

let initialTestStore = [];
for (const property in wcagCriteriaDictionary) {
  console.log(property);
  let temp = wcagCriteriaDictionary[property].map(
  (criterion) => {
    const newTest = new TestRequirement(criterion);
    const wcagVersionLd = `WCAG${property.replace('.', '')}`;
    newTest.id = `${wcagVersionLd}:${criterion.id}`;
    newTest.num = criterion.num;

    return newTest;
  });

  temp.forEach((t) => {
   initialTestStore.push(t); 
  });
}


// const initialTestStore = wcagCriteriaDictionary[LATEST_WCAG_VERSION].map(
//   (criterion) => {
//     const newTest = new TestRequirement(criterion);
//     const wcagVersionLd = `WCAG${LATEST_WCAG_VERSION.replace('.', '')}`;
//     newTest.id = `${wcagVersionLd}:${criterion.id}`;
//     newTest.num = criterion.num;

//     return newTest;
//   }
// );
console.log(initialTestStore);

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

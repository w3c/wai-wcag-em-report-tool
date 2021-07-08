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
const initialTestStore = wcagCriteriaDictionary[LATEST_WCAG_VERSION].map(
  (criterion) => {
    const newTest = new TestRequirement(criterion);
    const wcagVersionLd = `WCAG${LATEST_WCAG_VERSION.replace('.', '')}`;
    newTest.id = `${wcagVersionLd}:${criterion.id}`;
    newTest.num = criterion.num;

    return newTest;
  }
);

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

import { t as translate } from 'svelte-i18n';

import jsonld from '@app/scripts/jsonld.js';

import { getURL, isURL } from '@app/scripts/urls.js';

import { IMPORT_ERROR, JSONLD_ERROR } from '@app/data/errors.json';
import { importContext } from '@app/data/jsonld/appContext.js';

import collectionStore from '@app/stores/collectionStore.js';
import {
  isUntestedOutcome,
  OUTCOME,
  outcomeValueStore as outcomeValues
} from '@app/stores/earl/resultStore/index.js';
import subjects from '@app/stores/earl/subjectStore/index.js';
import tests from '@app/stores/earl/testStore/index.js';
import { getCriterionById } from '@app/stores/wcagStore.js';

import { AssertionTypes, Assertion } from './models.js';

const initialAssertions = [];
const assertions = collectionStore(Assertion, initialAssertions);

/**
 * Try to import Assertions from any JSON(-LD)
 * formatted file.
 * This can be a real pain to process due to the unknown
 * amount of Assertions available, depending on the creator
 * of these data files. It could be a few, but created with
 * automated test tools could be in the hundreds or thousands even.
 *
 * Roughly what we will be doing to be as performant as possible is:
 *  - [x] Walk the imported assertions once! (Preparation);
 *    - [x] Check for required keys; test, subject, result.
 *    - [x] Check if the test matches
 *    - [x] Check if the subject matches; check urlizable props and match against id
 *    - [x] If all pass, add the assertion as importable and combine results for test + subject combination
 *
 *  - [x] Walk the importableAssertions (Import)
 *    - [x] Get or create an assertion based on the test + subject.
 *    - [x] Agregate result.outcome;
 *          If starting result.outcome is not untested
 *          change to cantTell.
 *
 *    - [x] Append all result.description to the result.description.
 *
 * - Done
 *
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
 */
export async function importAssertions(json) {
  const importCount = {
    total: 0,
    successfull: 0,
    failed: 0
  };

  let $assertions;
  let $subjects;
  let $tests;
  let $outcomeValues;

  outcomeValues.subscribe((value) => {
    $outcomeValues = value;
  })();

  assertions.subscribe((value) => {
    $assertions = value;
  })();

  subjects.subscribe((value) => {
    $subjects = value;
  })();

  tests.subscribe((value) => {
    $tests = value;
  })();

  function matchSubject(subject) {
    const idUrl = getURL(subject.id);
    const subjectID = idUrl
      ? idUrl.href
      : ['source', 'description'].reduce((href, key) => {
        if (isURL(href)) {
          return href;
        }

        let url;

        if (subject[key]) {
          url = getURL(subject[key]);
        }

        return url ? url.href : null;
      }, '');

    if (isURL(subjectID)) {
      subject.id = subjectID;

      return $subjects.find(($subject) => {
        return $subject.id === subject.id;
      });
    }

    return null;
  }

  // Match against wcagStore > Test!
  function matchCriterion(test) {
    const { id, isPartOf } = test;
    const [, testID] = ((isPartOf && isPartOf.id) || id).split(':');
    const criterion = getCriterionById(testID);

    if (criterion) {
      return $tests.find(($test) => {
        return $test.num === criterion.num;
      });
    }

    return null;
  }

  function findMatch(Assertion) {
    const { test, subject, result } = Assertion;
    const matchedCriterion = matchCriterion(test);
    const matchedSubject = matchSubject(subject);

    if (matchedCriterion && matchedSubject && !isUntestedOutcome(result.outcome)) {
      return {
        subjectId: matchedSubject.id,
        criterionNum: matchedCriterion.num,
        result
      };
    }

    return false;
  }

  function updateAssertion(assertion, results) {
    const TRANSLATED = {};
    const testedResult = !results.some((importableAssertion) => {
      return importableAssertion.result.outcome.id === OUTCOME.UNTESTED.id;
    });

    translate.subscribe((get) => {
      TRANSLATED.getImportHeading = function getImportHeading(assertion) {
        const { assertedBy } = assertion;

        return get('UI.IMPORT.IMPORT.HEADING', {
          values: {
            AUTHOR: assertedBy.name || assertedBy.id, // Assertion.assertedBy
            IMPORT_DATE: new Date() // Assertion.result.date ?
          }
        });
      };
      TRANSLATED.IMPORT_RESULT_TEST = get('UI.IMPORT.IMPORT.TEST_PREFIX');
      TRANSLATED.OUTCOME = get('PAGES.AUDIT.LABEL_OUTCOME');
    })();

    results.forEach((importableAssertion) => {
      const { result, test } = importableAssertion;
      const $outcome = $outcomeValues.find(($outcomeValue) => {
        return $outcomeValue.id === result.outcome.id;
      });

      const resultString =
        `${TRANSLATED.getImportHeading(importableAssertion)}:` +
        `\n${TRANSLATED.IMPORT_RESULT_TEST}: ${test.title || ''} ${test.id}` +
        `\n${TRANSLATED.OUTCOME}: ${$outcome.title}` +
        `\n${result.description || ''}`;

      assertion.result.addDescription(resultString);
    });

    if (testedResult) {
      assertion.result.setOutcome(OUTCOME.CANT_TELL.id);
    }

    return assertion;
  }

  return await jsonld
    .frame(json, {
      '@context': importContext,
      '@type': AssertionTypes
    })

    // Catch jsonld errors
    .catch(() => {
      throw new Error(JSONLD_ERROR.SYNTAX);
    })

    // Get a collection of Assertions
    .then((AssertionFrame) => {
      return jsonld.getItems(AssertionFrame);
    })

    // Check which assertion is importable
    .then((Assertions) => {
      if (Assertions.length === 0) {
        throw new Error(IMPORT_ERROR.NO_ASSERTIONS);
      }

      /**
       * importableAssertions
       * Create this:
       *  {
       *    [criterion.num]: {
       *      [subject.id]: [
       *          ...importableAssertions
       *      ],
       *      ...subjects
       *    },
       *    ...criteria
       *  }
       * @type {[type]}
       */
      return (
        Assertions

          // Prepare imports
          .reduce((_importable, _Assertion) => {
            importCount.total++;

            // Check required assertion keys, skip further checks if not met
            if (!_Assertion.test || !_Assertion.subject || !_Assertion.result) {
              return _importable;
            }

            const matchedResult = findMatch(_Assertion);

            if (matchedResult) {
              importCount.successfull++;

              if (!_importable[matchedResult.criterionNum]) {
                _importable[matchedResult.criterionNum] = {};
              }

              if (
                !_importable[matchedResult.criterionNum][
                  matchedResult.subjectId
                ]
              ) {
                _importable[matchedResult.criterionNum][
                  matchedResult.subjectId
                ] = [];
              }

              _importable[matchedResult.criterionNum][
                matchedResult.subjectId
              ].push(_Assertion);
            }

            return _importable;
          }, {})
      );
    })

    // Start import
    .then((importableAssertions) => {
      if (importCount.successfull === 0) {
        throw new Error(IMPORT_ERROR.NO_COMPATIBLE_ASSERTIONS);
      }

      const startImport = window.confirm(
        `Import ${importCount.successfull} of ${importCount.total} results?`
      );

      if (!startImport) {
        throw new Error(IMPORT_ERROR.USER_DECLINED);
      }

      // Start import
      Object.keys(importableAssertions).forEach((criterionNum) => {
        const $test = $tests.find(($test) => {
          return $test.num === criterionNum;
        });

        Object.keys(importableAssertions[criterionNum]).forEach((subjectId) => {
          const $subject = $subjects.find(($subject) => {
            return $subject.id === subjectId;
          });
          const results = importableAssertions[criterionNum][subjectId];
          let foundAssertion = $assertions.find(($assertion) => {
            return (
              $assertion.test === $test &&
              $assertion.subject === $subject
            );
          });

          let newAssertion;

          if (foundAssertion) {
            updateAssertion(foundAssertion, results);
          } else {
            newAssertion = updateAssertion(
              assertions.create({ subject: $subject, test: $test }),
              results
            );
            $assertions.push(newAssertion);
          }
        });
      });

      // Update assertionStore afterward
      assertions.update(() => {
        return $assertions;
      });

      return importableAssertions;
    })

    .catch((error) => {
      throw error;
    });
}

export { AssertionTypes };

export default assertions;

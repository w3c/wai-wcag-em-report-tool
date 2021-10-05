import jsonld from '@app/scripts/jsonld.js';

import { writable } from 'svelte/store';
import { locale } from 'svelte-i18n';

import { version } from '../../package.json';
import { slugify } from '../scripts/slugify.js';

import appJsonLdContext, {
  importContext
} from '@app/data/jsonld/appContext.js';
import webTechnologies from '@app/data/webtechnologies.json';
import { downloadFileJSON } from '@app/scripts/files.js';

// Import related stores and combine
import { TestResult } from '@app/stores/earl/resultStore/models.js';
import { outcomeValueStore as outcomeValues } from '@app/stores/earl/resultStore/index.js';
import scopeStore, { initialScopeStore } from '@app/stores/scopeStore.js';
import exploreStore, { initialExploreStore, webTechnologyStore } from '@app/stores/exploreStore.js';
import sampleStore, { initialSampleStore } from '@app/stores/sampleStore.js';
import summaryStore, { initialSummaryStore } from '@app/stores/summaryStore.js';
import {
  DEFAULT_WCAG_VERSION,
  DEFAULT_CONFORMANCE_LEVEL,
  getCriterionById
} from '@app/stores/wcagStore.js';

import assertions, {
  AssertionTypes
} from '@app/stores/earl/assertionStore/index.js';
import subjects, {
  initialSubjectStore,
  TestSubjectTypes
} from '@app/stores/earl/subjectStore/index.js';
import tests from '@app/stores/earl/testStore/index.js';

const evaluationContext = {
  // Dublin Core Terms
  dcterms: 'http://purl.org/dc/terms/',
  title: 'dcterms:title',
  description: 'dcterms:description',
  summary: 'dcterms:summary',
  date: {
    '@id': 'dcterms:date',
    '@type': 'W3CDTF'
  },
  W3CDTF: 'http://www.w3.org/TR/NOTE-datetime',

  // EARL
  earl: 'http://www.w3.org/ns/earl#',

  // WCAG Context
  WAI: 'http://www.w3.org/WAI/',
  WCAG20: 'http://www.w3.org/TR/WCAG20/#',
  WCAG21: 'http://www.w3.org/TR/WCAG21/#',
  wcagVersion: 'WAI:standards-guidelines/wcag/#versions',
  reportToolVersion: 'wcagem:reportToolVersion',

  // WCAG-EM Context
  wcagem: 'http://www.w3.org/TR/WCAG-EM/#',
  Evaluation: 'wcagem:procedure',
  defineScope: 'wcagem:step1',
  scope: 'wcagem:step1a',
  conformanceTarget: 'wcagem:step1b',
  accessibilitySupportBaseline: 'wcagem:step1c',
  additionalEvaluationRequirements: 'wcagem:step1d',
  exploreTarget: 'wcagem:step2',
  essentialFunctionality: 'wcagem:step2b',
  pageTypeVariety: 'wcagem:step2c',
  technologiesReliedUpon: 'wcagem:step2d',
  selectSample: 'wcagem:step3',
  structuredSample: 'wcagem:step3a',
  randomSample: 'wcagem:step3b',
  auditSample: 'wcagem:step4',
  reportFindings: 'wcagem:step5',
  documentSteps: 'wcagem:step5a',
  commissioner: 'wcagem:commissioner',
  evaluator: 'wcagem:evaluator',
  evaluationSpecifics: 'wcagem:step5b'
};

const evaluationTypes = [
  'Evaluation',

  // Fallbacktype for previous versions
  'wcagem:Evaluation'
];

class EvaluationModel {
  constructor() {
    this['@context'] = evaluationContext;
    this['@type'] = evaluationTypes[0];
    this['@language'] = 'en';

    this.reportToolVersion = version;

    this.defineScope = {
      '@id': '_:defineScope',
      // First subject === scope / website
      scope: {
        // WEBSITE_NAME
        title: '',

        // WEBSITE_SCOPE
        description: ''
      },
      wcagVersion: DEFAULT_WCAG_VERSION,
      conformanceTarget: DEFAULT_CONFORMANCE_LEVEL,
      accessibilitySupportBaseline: '',
      additionalEvaluationRequirements: ''
    };

    this.exploreTarget = {
      '@id': '_:exploreTarget',
      technologiesReliedUpon: [],
      essentialFunctionality: '',
      pageTypeVariety: ''
    };

    this.selectSample = {
      '@id': '_:selectSample',
      randomSample: [],
      structuredSample: []
    };
    this.auditSample = [];
    this.reportFindings = {
      documentSteps: [
        {
          '@id': '_:about'
        },
        { '@id': '_:defineScope' },
        { '@id': '_:exploreTarget' },
        { '@id': '_:selectSample' }
      ],
      commissioner: '',
      date: new Date(),
      evaluator: '',
      evaluationSpecifics: '',
      summary: '',
      title: ''
    };
  }

  reset() {
    scopeStore.update(() => {
      return { ...initialScopeStore };
    });

    sampleStore.update(() => {
      return { ...initialSampleStore };
    });

    exploreStore.update(() => {
      return { ...initialExploreStore };
    });

    webTechnologyStore.reset();

    assertions.reset();

    subjects.reset();

    summaryStore.update(() => {
      return { ...initialSummaryStore };
    });
  }

  async open(openedEvaluation) {
    /**
     *  First save current data by copy
     *  to return to when loading fails.
     *
     */
    let openedJsonld;
    let language;
    let wcagVersion;

    /**
     *  Apply jsonld conversion to make sure
     *  valid data is presented (expand > compact).
     *
     *  @note: In future we can try to be forgiving and add a simple
     *  fix by setting '@context' on the object before expanding to json-ld.
     *  (As if we were enriching plain json to json-ld).
     *
     *  Return on error, otherwise continue.
     */
    await jsonld
      .expand(openedEvaluation)
      .then((expanded) => {
        openedJsonld = expanded;
      })
      .catch((error) => {
        console.error(
          `[Open Evaluation]: An error ocured while expanding json-ld; ${error.message}`
        );

        openedJsonld = false;
      });

    if (!openedJsonld) {
      return;
    }

    await this.reset();

    /**
     *  Frame the Evaluation object
     *  and read info:
     *  - language
     *  - wcagVersion
     *  - defineScope
     *  - exploreTarget
     *  - selectSample
     *  - auditSample
     *  - reportFindings
     */
    await jsonld
      .frame(openedJsonld, {
        '@context': importContext,
        '@type': evaluationTypes
      })
      .then(async (framedEvaluation) => {
        let $assertions;
        let $outcomeValues;
        let $subjects;
        let $tests;

        const unscribeStores = ((stores) => {
          let store;
          let unscribe;

          return () => {
            for (store in stores) {
              unscribe = stores[store];

              if (typeof unscribe === 'function') {
                unscribe();
              }
            }
          };
        })({
          assertions: assertions.subscribe((value) => {
            $assertions = value;
          }),
          outcomeValues: outcomeValues.subscribe((value) => {
            $outcomeValues = value;
          }),
          subjects: subjects.subscribe((value) => {
            $subjects = value;
          }),
          tests: tests.subscribe((value) => {
            $tests = value;
          })
        });

        let {
          auditSample,
          defineScope,
          exploreTarget,
          reportFindings,
          selectSample
        } = framedEvaluation;

        if (!auditSample) {
          auditSample = [];
        }

        if (!defineScope) {
          defineScope = {};
        }

        if (!exploreTarget) {
          exploreTarget = {};
        }

        if (!reportFindings) {
          reportFindings = {};
        }

        if (!selectSample) {
          selectSample = {};
        }
  
        language = framedEvaluation.language || 'en';
        locale.set(language);
        wcagVersion = defineScope.wcagVersion || DEFAULT_WCAG_VERSION;

        //Improved compatibility for older reports
        if(defineScope.step1b){
          if(defineScope.step1b == "WAI:WCAG2A-Conformance"){
            defineScope.step1b = "A";
          }else if(defineScope.step1b == "WAI:WCAG2AA-Conformance"){
            defineScope.step1b = "AA";
          }else if(defineScope.step1b == "WAI:WCAG2AAA-Conformance"){
            defineScope.step1b = "AAA";
          }else{
            defineScope.step1b = "AA";
          }
        }

        /**
         * Start setting values from the imported json-ld.
         * Any key that is defined in appContext
         * can be accessed, if not present the Context
         * should be updated as well with new or deprecated values.
         */
        scopeStore.update((value) => {
          const openedScope =
            defineScope.scope ||
            defineScope.DfnSetOfWebpagesWcag21 ||
            defineScope.DfnSetOfWebpagesWcag20;

          return Object.assign(value, {
            ADDITIONAL_REQUIREMENTS:
              defineScope.additionalEvaluationRequirements || '',
            AS_BASELINE: defineScope.accessibilitySupportBaseline || '',
            CONFORMANCE_TARGET: defineScope.conformanceTarget || defineScope.step1b || DEFAULT_CONFORMANCE_LEVEL,
            SITE_NAME:
              openedScope.title ||
              // Deprecated
              openedScope.name ||
              // Default
              '',
            WCAG_VERSION: wcagVersion,
            WEBSITE_SCOPE:
              openedScope.description ||
              // Deprecated
              openedScope.scope ||
              // Default
              ''
          });
        });

        exploreStore.update((value) => {
          let technologies =
            exploreTarget.technologiesReliedUpon ||
            framedEvaluation.DfnReliedUponTechnologyWcag21 ||
            framedEvaluation.DfnReliedUponTechnologyWcag20 ||
            [];

          if (!Array.isArray(technologies)) {
            technologies = [technologies];
          }

          return Object.assign(value, {
            TECHNOLOGIES_RELIED_UPON: technologies.map((tech) => tech.title || tech),
            ESSENTIAL_FUNCTIONALITY:
              exploreTarget.essentialFunctionality ||
              framedEvaluation.essentialFunctionality ||
              '',
            PAGE_TYPES:
              exploreTarget.pageTypeVariety ||
              framedEvaluation.pageTypeVariety ||
              ''
          });
        });

        sampleStore.update((value) => {
          const { structuredSample, randomSample } = selectSample;
          const deprecated = {
            structuredSample: framedEvaluation.structuredSample,
            randomSample: framedEvaluation.randomSample
          };

          let importStructuredSample = structuredSample
            ? structuredSample
            : // Deprecated / previous versions
            deprecated.structuredSample
              ? deprecated.structuredSample.DfnWebpageWcag21 ||
              deprecated.structuredSample.DfnWebpageWcag20
              : // Default
              [];

          let importRandomSample = randomSample
            ? randomSample
            : // Deprecated / previous versions
            deprecated.randomSample
              ? deprecated.randomSample.DfnWebpageWcag21 ||
              deprecated.randomSample.DfnWebpageWcag20
              : // Default
              [];

          if (!Array.isArray(importStructuredSample)) {
            importStructuredSample = [importStructuredSample];
          }

          if (!Array.isArray(importRandomSample)) {
            importRandomSample = [importRandomSample];
          }

          importStructuredSample.forEach((sample) => {
            if(Array.isArray(sample.title)){
              sample.title = sample.title[0];
            }
          });
          importRandomSample.forEach((sample) => {
            if(Array.isArray(sample.title)){
              sample.title = sample.title[0];
            }
          });
          
          if(importStructuredSample != undefined && importRandomSample != undefined){
            return {
              STRUCTURED_SAMPLE: importStructuredSample.map((sample) => {
                sample.type = TestSubjectTypes.WEBPAGE;

                return subjects.create(sample);
              }),
              RANDOM_SAMPLE: importRandomSample.map((sample) => {
                sample.type = TestSubjectTypes.WEBPAGE;

                return subjects.create(sample);
              })
            };
          }else{
            return {
              STRUCTURED_SAMPLE: [],
              RANDOM_SAMPLE: []
            };
          }
          
        });

        //Improved compatibility for older reports
        let altCreator = "";
        if(framedEvaluation["dcterms:creator"]){
          altCreator = framedEvaluation["dcterms:creator"]["http://xmlns.com/foaf/0.1/name"];
        }
        let altDate = "";
        if(reportFindings.date){
          altDate = reportFindings.date['@value'];
        }

        summaryStore.update((value) => {
          return Object.assign(value, {
            EVALUATION_TITLE:
              reportFindings.title || framedEvaluation.title || '',
            EVALUATION_COMMISSIONER:
              reportFindings.commissioner ||
              framedEvaluation.commissioner ||
              '',
            EVALUATION_CREATOR: reportFindings.evaluator || altCreator || '',
            EVALUATION_DATE: altDate || framedEvaluation.date || '',
            EVALUATION_SUMMARY:
              reportFindings.summary || framedEvaluation.summary || '',
            EVALUATION_SPECIFICS:
              reportFindings.evaluationSpecifics ||
              framedEvaluation.evaluationSpecifics ||
              ''
          });
        });

        // Frame Assertions within the Evaluation
        await jsonld
          .frame(framedEvaluation, {
            '@context': importContext,
            '@type': AssertionTypes
          })
          .then((framedAssertions) => {
            jsonld.getItems(framedAssertions).forEach((assertion) => {
              const { assertedBy, mode, result, subject, test } = assertion;
              let newSubject = $subjects.find(($subject) => {
                if (
                  jsonld.hasType($subject, [TestSubjectTypes.WEBSITE, 'WebSite'])
                ) {
                  return jsonld.hasType($subject, TestSubjectTypes.WEBSITE);
                }

                return (
                  $subject.id === subject.id ||
                  $subject.id ===
                    jsonld.setIdFromProperties(subject, [
                      'description',
                      'source'
                    ]).id
                );
              });

              let newResult = result
                ? new TestResult(result)
                : new TestResult();
              newResult.outcome = $outcomeValues.find(($outcomeValue) => {
                return $outcomeValue.id === newResult.outcome.id;
              });

              let newTest = $tests.find(($test) => {
                // In previous versions a testcase was set on Assertions
                // that was part of the main Assertion
                // undo this here.
                const _test = test ? test : assertion.testcase || {};
                const _testId = _test.id || _test;
                // WCAG2X:criterion-id
                const scID = _testId.split(':').slice(-1)[0];

                if (!scID) {
                  return false;
                }

                return (
                  // Match test.num === crit.num
                  $test.num === getCriterionById(scID).num
                );
              });

              if (newSubject && newTest) {
                (function addAssertion(newAssertion) {
                  // const foundAssertion = $assertions.find(($assertion) => {
                  //   return (
                  //     $assertion.test === newAssertion.test &&
                  //     $assertion.subject === newAssertion.subject
                  //   );
                  // });
                  // console.log(foundAssertion);
                  // if (foundAssertion) {
                  //   console.log("found");
                  //   // foundAssertion.result = newAssertion.result;
                  //   // foundAssertion.subject = assertion.subject;
                  //   if(foundAssertion.subject == newAssertion.subject){
                  //     foundAssertion.result = newAssertion.result;
                  //     foundAssertion.subject = assertion.subject;
                  //   }else{
                  //     assertion.test = newTest;
                  //     assertions.create(assertion);
                  //   }
                  // } else {
                  //   assertions.create(newAssertion);
                  // }
                  if(assertion.subject.type.indexOf("Website") >= 0 || newAssertion.subject.type.indexOf("Website") >= 0){
                    assertions.create(newAssertion);
                  }else {
                    newSubject = $subjects.find(($subject) => {
                      return $subject.title == assertion.subject.title;
                    });
                    assertion.subject = newSubject;
                    assertion.result = newResult;
                    assertion.test = newTest;
                    assertions.create(assertion);
                  }
                })({
                  assertedBy,
                  mode,
                  result: newResult,
                  subject: newSubject,
                  test: newTest
                });
              }
            });
          });
        
        unscribeStores();
      });

    /**
     *  Read / Determine the (asumed) wcagVersion
     *  - Read the first Assertion found and find the right test
     *    '@id's are translated here as well and supported WCAG versions
     *    are contained in @context. If WCAG version + id does not Match
     *    a fix on the data is required first, e.g. check other version of wcag.
     *
     *  Return on error or no matches found.
     */

    /**
     *  Ready to start loading: Remove current data set?
     */

    /**
     *  Read all samples (TestSubject, WebPage) and recreate.
     *  Replace the sample with the created one.
     */

    /**
     *  Read all Assertions
     *  For each Assertion:
     *  - Create a new appAssertion with Assertion values present in the assertionStore
     *    - Match tests by '@id'
     *    - Match subject by '@id'
     *    - Set result values; outcome and description
     *    - ...
     */

    /**
     * Read / set other values (scope, explore, sample, summary, ...)
     */

    /**
     * Open the evaluation/scope page
     */
  }

  save() {
    jsonld
      .compact(this, appJsonLdContext)
      .then((compacted) => {
        downloadFileJSON({
          name: `${compacted.defineScope.scope.title ? slugify(compacted.defineScope.scope.title) + '-': ""}evaluation.json`,
          type: 'application/json',
          contents: JSON.stringify(compacted)
        });
      })
      .catch((error) => {
        console.error(`An error occured: “${error.name}”\n${error.message}`);
      });
  }

}

const _evaluation = writable(new EvaluationModel());

export default (
  [
    assertions,
    locale,
    subjects,
    scopeStore,
    exploreStore,
    sampleStore,
    summaryStore
  ],
  ([
    $assertions,
    $locale,
    $subjects,
    $scopeStore,
    $exploreStore,
    $sampleStore,
    $summaryStore
  ]) => {
    const {
      ADDITIONAL_REQUIREMENTS,
      AS_BASELINE,
      CONFORMANCE_TARGET,
      WCAG_VERSION
    } = $scopeStore;
    const { RANDOM_SAMPLE, STRUCTURED_SAMPLE } = $sampleStore;

    const {
      ESSENTIAL_FUNCTIONALITY,
      PAGE_TYPES,
      TECHNOLOGIES_RELIED_UPON
    } = $exploreStore;

    const {
      EVALUATION_CREATOR,
      EVALUATION_COMMISSIONER,
      EVALUATION_DATE,
      EVALUATION_SPECIFICS,
      EVALUATION_SUMMARY,
      EVALUATION_TITLE
    } = $summaryStore;

    _evaluation['@language'] = $locale;

    Object.assign(_evaluation.defineScope, {
      scope: $subjects.find(($subject) => {
        return $subject.type.indexOf(TestSubjectTypes.WEBSITE) >= 0;
      }),
      wcagVersion: WCAG_VERSION,
      conformanceTarget: CONFORMANCE_TARGET,
      accessibilitySupportBaseline: AS_BASELINE,
      additionalEvaluationRequirements: ADDITIONAL_REQUIREMENTS
    });

    Object.assign(_evaluation.exploreTarget, {
      technologiesReliedUpon: webTechnologies.filter(
        (tech) => TECHNOLOGIES_RELIED_UPON.indexOf(tech.title) >= 0
      ),
      essentialFunctionality: ESSENTIAL_FUNCTIONALITY,
      pageTypeVariety: PAGE_TYPES
    });

    Object.assign(_evaluation.selectSample, {
      randomSample: RANDOM_SAMPLE,
      structuredSample: STRUCTURED_SAMPLE
    });

    _evaluation.auditSample = $assertions;

    Object.assign(_evaluation.reportFindings, {
      commissioner: EVALUATION_COMMISSIONER,
      date: EVALUATION_DATE,
      evaluator: EVALUATION_CREATOR,
      evaluationSpecifics: EVALUATION_SPECIFICS,
      summary: EVALUATION_SUMMARY,
      title: EVALUATION_TITLE
    });

    return _evaluation;
  },
  _evaluation
);

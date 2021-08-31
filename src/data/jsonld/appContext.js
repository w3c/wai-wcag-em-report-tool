/*
 * Used in previous versions and removed
 * due to wrong implementation or,
 * to simplify json-ld dependencies to just
 * dublin core, earl, wcag-em.
 * If required to specify,
 * prefer resources from w3c when possible,
 * otherwise keep it simple and stupid.
 */
const deprecatedContext = {
  DfnTechnologyWcag20: 'WCAG20:technologydef',
  DfnReliedUponTechnologyWcag20: 'WCAG20:reliedupondef',
  DfnSetOfWebpagesWcag20: 'WCAG20:set-of-web-pagesdef',
  DfnWebpageWcag20: 'WCAG20:webpagedef',

  DfnTechnologyWcag21: 'WCAG21:dfn-technologies',
  DfnReliedUponTechnologyWcag21: 'WCAG21:dfn-relied-upon',
  DfnSetOfWebpagesWcag21: 'WCAG21:dfn-set-of-web-pages',
  DfnWebpageWcag21: 'WCAG21:dfn-web-page-s',

  testcase: 'wcagem:testcase',

  // Unnecassary source for sample / subjects
  // If an url is provided with the descriptionfield
  // it is used as an identifier
  // Use jsonld`(@)id` instead.
  source: {
    '@id': 'dcterms:source',
    '@type': '@id'
  },

  // Schema
  schema: 'http://schema.org/',
  name: 'schema:name',
  WebSite: 'schema:WebSite',
  WebPage: 'schema:WebPage'
};

export const exportContext = {
  reporter: 'http://github.com/w3c/wai-wcag-em-report-tool/',

  // WCAG-EM
  wcagem: 'http://www.w3.org/TR/WCAG-EM/#',
  Evaluation: 'wcagem:procedure',
  defineScope: 'wcagem:step1',
  scope: 'wcagem:step1a',
  step1b: {
    '@id': 'wcagem:step1b',
    '@type': '@id'
  },
  conformanceTarget: 'step1b',
  accessibilitySupportBaseline: 'wcagem:step1c',
  additionalEvaluationRequirements: 'wcagem:step1d',
  exploreTarget: 'wcagem:step2',
  essentialFunctionality: 'wcagem:step2b',
  pageTypeVariety: 'wcagem:step2c',
  technologiesReliedUpon: 'wcagem:step2d',
  selectSample: 'wcagem:step3',
  structuredSample: 'wcagem:step3a',
  randomSample: 'wcagem:step3b',
  Website: 'wcagem:website',
  Webpage: 'wcagem:webpage',
  auditSample: 'wcagem:step4',
  reportFindings: 'wcagem:step5',
  documentSteps: 'wcagem:step5a',
  commissioner: 'wcagem:commissioner',
  evaluator: 'wcagem:evaluator',
  evaluationSpecifics: 'wcagem:step5b',

  // WCAG
  WCAG: 'http://www.w3.org/TR/WCAG/#',
  WCAG20: 'http://www.w3.org/TR/WCAG20/#',
  WCAG21: 'http://www.w3.org/TR/WCAG21/#',

  WAI: 'http://www.w3.org/WAI/',
  A: 'WAI:WCAG2A-Conformance',
  AA: 'WAI:WCAG2AA-Conformance',
  AAA: 'WAI:WCAG2AAA-Conformance',
  wcagVersion: 'WAI:standards-guidelines/wcag/#versions',
  reportToolVersion: 'wcagem:reportToolVersion',

  // EARL
  earl: 'http://www.w3.org/ns/earl#',

  // - earl:Classes
  Assertion: 'earl:Assertion',
  TestMode: 'earl:TestMode',
  TestCriterion: 'earl:TestCriterion',
  TestCase: 'earl:TestCase',
  TestRequirement: 'earl:TestRequirement',
  TestSubject: 'earl:TestSubject',
  TestResult: 'earl:TestResult',
  OutcomeValue: 'earl:OutcomeValue',
  Pass: 'earl:Pass',
  Fail: 'earl:Fail',
  CannotTell: 'earl:CannotTell',
  NotApplicable: 'earl:NotApplicable',
  NotTested: 'earl:NotTested',

  // - earl:properties
  assertedBy: 'earl:assertedBy',
  mode: 'earl:mode',
  result: 'earl:result',
  subject: 'earl:subject',
  test: 'earl:test',
  outcome: 'earl:outcome',

  // Dublin Core
  dcterms: 'http://purl.org/dc/terms/',
  title: 'dcterms:title',
  description: 'dcterms:description',
  summary: 'dcterms:summary',
  date: 'dcterms:date',
  hasPart: 'dcterms:hasPart',
  isPartOf: 'dcterms:isPartOf',

  // @json-ld; Makes props accessible by dotnotation
  id: '@id',
  type: '@type',
  language: '@language'
};

export const importContext = {
  // Add deprecatedContext to support previous versions of this tool
  ...deprecatedContext,
  ...exportContext
};

export default exportContext;

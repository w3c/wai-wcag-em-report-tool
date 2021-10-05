import { Base as BaseModel } from '@app/stores/earl/models.js';
import { TestResult } from '@app/stores/earl/resultStore/models.js';

export const AssertionTypes = ['Assertion'];
export class Assertion extends BaseModel {
  constructor(options = {}) {
    super(options);

    const REQUIRED_OPTIONS = ['subject', 'test'];

    if (REQUIRED_OPTIONS.some((option) => options[option] === undefined)) {
      throw Error(
        `[Assertion]: Expected required options: ${REQUIRED_OPTIONS.join(
          ', '
        )}, but only got ${Object.keys(options).join(', ')}`
      );
    }

    Object.assign(this['@context'], {
      Assertion: 'earl:Assertion',
      assertedBy: {
        '@id': 'earl:assertedBy',
        '@type': 'earl:Assertor'
      },
      mode: {
        '@id': 'earl:mode',
        '@type': 'earl:TestMode'
      },
      result: {
        '@id': 'earl:result',
        '@type': 'earl:TestResult'
      },
      subject: {
        '@id': 'earl:subject',
        '@type': 'earl:TestSubject'
      },
      test: {
        '@id': 'earl:test',
        '@type': 'earl:TestCriterion'
      }
    });

    this.type = AssertionTypes;
    this.assertedBy = options.assertedBy;
    this.mode = 'earl:manual';
    this.result = new TestResult(options.result || {});
    this.subject = options.subject;
    this.test = options.test;
  }
}

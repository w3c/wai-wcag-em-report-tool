import { Base as BaseModel } from '@app/stores/earl/models.js';

export class OutcomeValue extends BaseModel {
  constructor(options) {
    super(options);

    const { type } = options;
    const ALLOWED_TYPES = [
      'Pass',
      'Fail',
      'CannotTell',
      'NotApplicable',
      'NotTested'
    ];

    Object.assign(this['@context'], {
      OutcomeValue: 'earl:OutcomeValue',
      Pass: 'earl:Pass',
      Fail: 'earl:Fail',
      CannotTell: 'earl:CannotTell',
      NotApplicable: 'earl:NotApplicable',
      NotTested: 'earl:NotTested'
    });

    this.type = ['OutcomeValue'];

    if (ALLOWED_TYPES.indexOf(type) >= 0) {
      this.type.push(type);
    }

    delete this.date;
  }

  update() {}
}

const PASSED = new OutcomeValue({
  id: 'earl:passed',
  type: 'Pass'
});
Object.freeze(PASSED);

const FAILED = new OutcomeValue({
  id: 'earl:failed',
  type: 'Fail'
});
Object.freeze(FAILED);

const CANT_TELL = new OutcomeValue({
  id: 'earl:cantTell',
  type: 'CannotTell'
});
Object.freeze(CANT_TELL);

const INAPPLICABLE = new OutcomeValue({
  id: 'earl:inapplicable',
  type: 'NotApplicable'
});
Object.freeze(INAPPLICABLE);

const UNTESTED = new OutcomeValue({
  id: 'earl:untested',
  type: 'NotTested'
});
Object.freeze(UNTESTED);

export const OUTCOME = {
  PASSED,
  FAILED,
  CANT_TELL,
  INAPPLICABLE,
  UNTESTED
};
Object.freeze(OUTCOME);

const outcomeValues = [PASSED, FAILED, CANT_TELL, INAPPLICABLE, UNTESTED];

export class ImpactValue extends BaseModel {
  constructor(options) {
    super(options);

    const { type } = options;
    const ALLOWED_TYPES = [
      'Pass',
      'Fail',
      'CannotTell',
      'NotApplicable',
      'NotTested'
    ];

    Object.assign(this['@context'], {
      ImpactValue: 'earl:ImpactValue',
      Pass: 'earl:Pass',
      Fail: 'earl:Fail',
      CannotTell: 'earl:CannotTell',
      NotApplicable: 'earl:NotApplicable',
      NotTested: 'earl:NotTested'
    });

    this.type = ['ImpactValue'];

    if (ALLOWED_TYPES.indexOf(type) >= 0) {
      this.type.push(type);
    }

    delete this.date;
  }

  update() {}
}

const HIGH_PRIORITY = new ImpactValue({
  id: 'earl:highPriority',
  type: 'HighPriority'
});
Object.freeze(HIGH_PRIORITY);

const WARNING = new ImpactValue({
  id: 'earl:warning',
  type: 'Warning'
});
Object.freeze(WARNING);

const BEST_PRACTICE = new ImpactValue({
  id: 'earl:bestPractice',
  type: 'BestPractice'
});
Object.freeze(BEST_PRACTICE);

const NO_IMPACT = new ImpactValue({
  id: 'earl:noImpact',
  type: 'NoImpact'
});
Object.freeze(NO_IMPACT);

export const IMPACT = {
  HIGH_PRIORITY,
  WARNING,
  BEST_PRACTICE,
  NO_IMPACT
};
Object.freeze(IMPACT);

const impactValues = [HIGH_PRIORITY, WARNING, BEST_PRACTICE, NO_IMPACT];

export class TestResult extends BaseModel {
  constructor(options = {}) {
    super(options);

    Object.assign(this['@context'], {
      TestResult: 'earl:TestResult',
      OutcomeValue: 'earl:OutcomeValue',
      outcome: {
        '@id': 'earl:outcome',
        '@type': 'earl:OutcomeValue'
      },
      ImpactValue: 'earl:ImpactValue',
      impact: {
        '@id': 'earl:impact',
        '@type': 'earl:ImpactValue'
      }
    });

    this.type = ['TestResult'];

    this.outcome = this.setOutcome(
      (options.outcome && options.outcome.id) || OUTCOME.UNTESTED.id
    );

    this.impact = this.setImpact(
      (options.impact && options.impact.id) || IMPACT.NO_IMPACT.id
    );
  }

  /**
   * Set the outcome by OutcomeValue id
   * @param {String} id ld string, compacted IRI e.g. earl:passed
   */
  setOutcome(id) {
    if (typeof id !== 'string') {
      console.warn('[setOutcome]: Expected id to be defined as type string.');
    }

    const newOutcome = [...outcomeValues].find((outcome) => {
      return outcome.id === id;
    });

    if (newOutcome) {
      this.outcome = newOutcome;
    }

    return newOutcome;
  }

  /**
   * Set the impact by ImpactValue id
   * @param {String} id ld string, compacted IRI e.g. earl:warning
   */
  setImpact(id) {
    if (typeof id !== 'string') {
      console.warn('[setImpact]: Expected id to be defined as type string.');
    }

    const newImpact = [...impactValues].find((impact) => {
      return impact.id === id;
    });

    if (newImpact) {
      this.impact = newImpact;
    }

    return newImpact;
  }

  /**
   * Add contents to description
   * seperated by a newline.
   * @param {String} contents
   * @return {String} New description value.
   */
  addDescription(contents = '') {
    if (typeof contents !== 'string') {
      console.warn(
        '[addDescription]: Expected contents to be of type string. Treating as empty string.'
      );
      contents = '';
    }

    const newDescription = [this.description, contents].join('\n\n').trim();

    if (contents.length > 0) {
      this.description = newDescription;
    }

    return newDescription;
  }
}

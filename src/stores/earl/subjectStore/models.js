import { getURL } from '@app/scripts/urls.js';
import { Base, partsMixin } from '../models.js';

export const TestSubjectTypes = {
  TESTSUBJECT: 'TestSubject',
  WEBSITE: 'Website',
  WEBPAGE: 'Webpage'
};

export const TestSubjectContext = {
  [TestSubjectTypes.TESTSUBJECT]: 'earl:TestSubject',
  wcagem: 'http://www.w3.org/TR/WCAG-EM/#',
  [TestSubjectTypes.WEBSITE]: 'wcagem:website',
  [TestSubjectTypes.WEBPAGE]: 'wcagem:webpage'
};

export class TestSubject extends partsMixin(Base) {
  constructor(options = {}) {
    super(options);

    let { type } = options;
    const ALLOWED_TYPES = [
      TestSubjectTypes.WEBSITE,
      TestSubjectTypes.WEBPAGE
    ];

    this['@context'] = {
      ...this['@context'],
      ...TestSubjectContext
    };

    this.id = this.setId();

    this.type = [TestSubjectTypes.TESTSUBJECT];

    if (!Array.isArray(type)) {
      type = [type];
    }

    if (!this.title) {
      this.title = '';
    }

    if (!this.description) {
      this.description = '';
    }

    type.forEach((t) => {
      if (ALLOWED_TYPES.indexOf(t) >= 0) {
        this.type.push(t);
      }
    });
  }

  setId() {
    const { ID, id, title, description } = this;
    const url = [title, description].reduce((href, value) => {
      if (href) {
        return href;
      }

      let newURL;
      if(value != undefined){
        newURL = getURL(value);
      }
      
      return newURL ? newURL.href : '';
    }, '');
    
    return url ? url : `_:subject_${ID}`;
  }
}

// id lookup
// May be better to move this to collectionStore
const _ids = {};

export const partsMixin = (SuperClass) =>
  class PartsMixin extends SuperClass {
    constructor(options = {}) {
      super(options);

      Object.assign(this['@context'], {
        hasPart: 'dcterms:hasPart',
        isPartOf: 'dcterms:isPartOf'
      });
      this.hasPart = options.hasPart;
      this.isPartOf = options.isPartOf;
    }
  };

export class Base {
  constructor(options = {}) {
    const { ID, date, title, description, summary } = options;

    this['@context'] = {
      earl: 'http://www.w3.org/ns/earl#',
      dcterms: 'http://purl.org/dc/terms/',
      title: 'dcterms:title',
      date: 'dcterms:date',
      description: 'dcterms:description',
      id: '@id',
      type: '@type'
    };

    if (options.id) {
      this.id = options.id;
    }

    this.ID = ID ? ID : createID(this.constructor.name);
    this.date = date ? createDate(date) : createDate();
    this.title = title;
    this.description = description;
    this.summary = summary;
  }

  setDate(date) {
    this.date = createDate(date);
  }
}

function createDate(date = new Date()) {
  let dateString;

  try {
    dateString = new Date(date).toISOString();
  } catch (e) {
    console.warn(`[createDate]: ${e.message}`);
    dateString = date;
  }

  return dateString;
}

function createID(className) {
  let currentIds = _ids[className];
  let newId;

  if (!currentIds) {
    currentIds = _ids[className] = [];
  }

  newId = currentIds.length > 0 ? Math.max.apply(null, currentIds) + 1 : 1;

  currentIds.push(newId);

  return newId;
}

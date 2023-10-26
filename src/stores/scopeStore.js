import { writable } from 'svelte/store';

export const initialScopeStore = {
  ADDITIONAL_REQUIREMENTS: '',
  AS_BASELINE: '',
  CONFORMANCE_TARGET: 'AA',
  SITE_NAME: '',
  WCAG_VERSION: '2.2',
  WEBSITE_SCOPE: ''
};

const scopeStore = writable({...initialScopeStore});

export default scopeStore;

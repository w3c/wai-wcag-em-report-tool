<p class="your-report__description">
  {TRANSLATED.REPORTED_ON} 
  {totalEvaluated} 
  {TRANSLATED.REPORTED_ON_OF} 
  {criteria} WCAG {wcagVersion}
  {conformanceTarget}
  {TRANSLATED.SUCCESS_CRITERIA}.
</p>

<script>
  import { getContext } from 'svelte';

  import assertions from '@app/stores/earl/assertionStore/index.js';
  import { CriteriaSelected } from '@app/stores/selectedCriteriaStore.js';
  import subjects, { TestSubjectTypes } from '@app/stores/earl/subjectStore/index.js';

  const { translate, scopeStore } = getContext('app');

  export let criteria = 0;

  $: wcagVersion = $scopeStore['WCAG_VERSION'];
  $: conformanceTarget = $scopeStore['CONFORMANCE_TARGET'];

  $: TRANSLATED = {
    REPORTED_ON: $translate('UI.REPORT.REPORTED_ON'),
    REPORTED_ON_OF: $translate('UI.REPORT.REPORTED_ON_OF'),
    SUCCESS_CRITERIA: $translate('UI.REPORT.SUCCESS_CRITERIA')
  };

  $: totalEvaluated = $assertions.filter(assertion => 
   assertion.result.outcome.id !== "earl:untested" && assertion.subject.type.indexOf(TestSubjectTypes.WEBSITE) >= 0).length;

</script>

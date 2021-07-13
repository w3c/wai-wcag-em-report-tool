<Page title="{$summaryStore['EVALUATION_TITLE'] ? $summaryStore['EVALUATION_TITLE'] : TRANSLATED.PAGE_TITLE}" pageid="view-report">

    <Button on:click="{handleHTMLDownloadClick}">
      <span>{TRANSLATED.BUTTON_SAVE_HTML}</span>
    </Button>
    <Button on:click="{handleJSONDownloadClick}">
      <span>{TRANSLATED.BUTTON_SAVE_JSON}</span>
    </Button>

  <Report />
</Page>

<script>
  import { getContext } from 'svelte';

  import evaluationStore from '@app/stores/evaluationStore.js';
  import summaryStore from '@app/stores/summaryStore.js';
  import scopeStore from '@app/stores/scopeStore.js';
  import sampleStore from '@app/stores/sampleStore.js';
  import exploreStore from '@app/stores/exploreStore.js';
  import subjects, {
  initialSubjectStore,
  TestSubjectTypes
  } from '@app/stores/earl/subjectStore/index.js';
  import assertions from '@app/stores/earl/assertionStore/index.js';

  import Button from '@app/components/ui/Button.svelte';
  import Page from '@app/components/ui/Page.svelte';
  import Report, { downloadReport } from '@app/components/ui/Report.svelte';

  const { translate } = getContext('app');

  $: TRANSLATED = {
    PAGE_TITLE: $translate('PAGES.REPORT.TITLE'),
    BUTTON_SAVE_HTML: $translate('PAGES.REPORT.BTN_SAVE_HTML'),
    BUTTON_SAVE_JSON: $translate('PAGES.REPORT.BTN_SAVE_JSON')
  };

  function handleHTMLDownloadClick() {
    downloadReport();
  }


  function handleJSONDownloadClick() {
    forceEvaluationUpdate();
    $evaluationStore.save();
  }

  function forceEvaluationUpdate() {
    $evaluationStore.reportFindings.evaluator = $summaryStore.EVALUATION_CREATOR;
    $evaluationStore.reportFindings.commissioner = $summaryStore.EVALUATION_COMMISSIONER;
    $evaluationStore.reportFindings.date = $summaryStore.EVALUATION_DATE;
    $evaluationStore.reportFindings.summary = $summaryStore.EVALUATION_SUMMARY;
    $evaluationStore.reportFindings.title = $summaryStore.EVALUATION_TITLE;
    $evaluationStore.defineScope.scope = {description: $scopeStore.WEBSITE_SCOPE, title: $scopeStore.SITE_NAME}
    $evaluationStore.defineScope.wcagVersion = $scopeStore.WCAG_VERSION;
    $evaluationStore.defineScope.conformanceTarget = $scopeStore.CONFORMANCE_TARGET;
    $evaluationStore.defineScope.accessibilitySupportBaseline = $scopeStore.AS_BASELINE;
    $evaluationStore.defineScope.additionalEvaluationRequirements = $scopeStore.ADDITIONAL_REQUIREMENTS;

    $evaluationStore.auditSample = $assertions;

    $evaluationStore.selectSample.structuredSample = $sampleStore['STRUCTURED_SAMPLE'];
    $evaluationStore.selectSample.randomSample = $sampleStore['RANDOM_SAMPLE'];
    $evaluationStore.exploreTarget.technologiesReliedUpon = $exploreStore['TECHNOLOGIES_RELIED_UPON'];
    $evaluationStore.exploreTarget.essentialFunctionality = $exploreStore['ESSENTIAL_FUNCTIONALITY'];
    $evaluationStore.exploreTarget.pageTypeVariety = $exploreStore['PAGE_TYPES'];

  }

</script>

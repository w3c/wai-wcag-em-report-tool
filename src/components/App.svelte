<!-- @Component:App -->
{#if $isLoading}
  <p>Loading WCAG Report Tool</p>
{:else}
  <BaseRoute basepath="{basepath}" />
{/if}
<!-- /Component -->

<script>
  import { setContext, getContext, onMount } from 'svelte';
  import { isLoading } from 'svelte-i18n';

  import { translate, translateToObject } from '@app/stores/i18nStore.js';
  import auditStore from '@app/stores/auditStore.js';
  import exploreStore from '@app/stores/exploreStore.js';
  import sampleStore from '@app/stores/sampleStore.js';
  import scopeStore from '@app/stores/scopeStore.js';
  import summaryStore from '@app/stores/summaryStore.js';
  import wcagStore from '@app/stores/wcagStore.js';
  import {
    outcomeValueStore,
    impactValueStore
  } from '@app/stores/earl/resultStore/index.js';
  import { basepath as storedBasepath } from '@app/stores/appStore.js';
  import evaluationStore from '@app/stores/evaluationStore.js';
  import assertions from '@app/stores/earl/assertionStore/index.js';

  import BaseRoute from '@app/components/routes/BaseRoute.svelte';

  export let basepath = '';

  setContext('app', {
    translate,
    translateToObject,
    auditStore,
    exploreStore,
    sampleStore,
    scopeStore,
    summaryStore,
    wcagStore
  });

  setContext('Evaluation', {
    outcomeValues: outcomeValueStore,
    impactValues: impactValueStore,
    wcagCriteria: wcagStore
  });

  setContext('updateEvaluation', forceEvaluationUpdate);
  const updateEvaluation = getContext('updateEvaluation');

  const { wcagCriteria } = getContext('Evaluation');
  import { CriteriaSelected } from '@app/stores/selectedCriteriaStore.js';
  import { CriteriaFiltered } from '@app/stores/filteredCriteriaStore.js';
  import { WCAG_VERSIONS } from '@app/stores/wcagStore.js';
  $: if (selectedCriteria) {
    CriteriaSelected.set(selectedCriteria);
    CriteriaFiltered.set(selectedCriteria);
  }
  $: selectedCriteria = $wcagCriteria
    // Filter by version
    .filter((criterion) => {
      const filterVersions = WCAG_VERSIONS;

      // Pass filtering if not enabled
      if (filterVersions.length === 0) {
        return true;
      }

      return filterVersions.indexOf(criterion.version) >= 0;
    })
    // Filter by conformance level
    .filter((criterion) => {
      const filterLevels = $scopeStore['CONFORMANCE_TARGET'];

      // Pass filtering if not enabled
      if (filterLevels.length === 0) {
        return true;
      }

      return filterLevels.indexOf(criterion.conformanceLevel) >= 0;
    });

  onMount(() => {
    window.addEventListener('input', setInteracted);
    storedBasepath.set(basepath);
    document.addEventListener('keydown', saveReportJSON);
  });

  function setInteracted() {
    window.removeEventListener('input', setInteracted);
    //set some var to notify us of user changes
    window.onbeforeunload = closeEditorWarning;
  }

  function closeEditorWarning() {
    return 'Are you sure?';
  }

  function saveReportJSON(e) {
    if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleJSONDownloadClick();
    }
  }

  function handleJSONDownloadClick() {
    updateEvaluation();
    $evaluationStore.save();
  }

  function forceEvaluationUpdate() {
    $evaluationStore.reportFindings.evaluator =
      $summaryStore.EVALUATION_CREATOR;
    $evaluationStore.reportFindings.commissioner =
      $summaryStore.EVALUATION_COMMISSIONER;
    $evaluationStore.reportFindings.date = $summaryStore.EVALUATION_DATE;
    $evaluationStore.reportFindings.summary = $summaryStore.EVALUATION_SUMMARY;
    $evaluationStore.reportFindings.title = $summaryStore.EVALUATION_TITLE;
    $evaluationStore.defineScope.scope = {
      description: $scopeStore.WEBSITE_SCOPE,
      title: $scopeStore.SITE_NAME
    };
    $evaluationStore.defineScope.wcagVersion = $scopeStore.WCAG_VERSION;
    $evaluationStore.defineScope.conformanceTarget =
      $scopeStore.CONFORMANCE_TARGET;
    $evaluationStore.defineScope.accessibilitySupportBaseline =
      $scopeStore.AS_BASELINE;
    $evaluationStore.defineScope.additionalEvaluationRequirements =
      $scopeStore.ADDITIONAL_REQUIREMENTS;

    $evaluationStore.auditSample = $assertions;

    $evaluationStore.selectSample.structuredSample =
      $sampleStore['STRUCTURED_SAMPLE'];
    $evaluationStore.selectSample.randomSample = $sampleStore['RANDOM_SAMPLE'];
    $evaluationStore.exploreTarget.technologiesReliedUpon =
      $exploreStore['TECHNOLOGIES_RELIED_UPON'];
    $evaluationStore.exploreTarget.essentialFunctionality =
      $exploreStore['ESSENTIAL_FUNCTIONALITY'];
    $evaluationStore.exploreTarget.pageTypeVariety =
      $exploreStore['PAGE_TYPES'];
    $evaluationStore.reportFindings.evaluationSpecifics =
      $summaryStore.EVALUATION_SPECIFICS;
  }
</script>

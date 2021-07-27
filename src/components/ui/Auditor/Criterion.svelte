<!--
 * @component
 * Criterion
 * -->
<div class="criterion" id={`criterion-${normaliseId(test)}`} data-version={version}>
  <header class="criterion-header">
    <h3>{num}: {TRANSLATED.CRITERION.TITLE}</h3>
    <em class="criterion-header__level">Level {conformanceLevel}</em>
    <div class="criterion__resource-links">
      <ResourceLink
        href="https://www.w3.org/WAI/WCAG21/Understanding/{id}.html"
      >
        {TRANSLATED.UNDERSTAND_BUTTON}
        {num}
      </ResourceLink>
      <ResourceLink href="https://www.w3.org/WAI/WCAG21/quickref/#{id}">
        {TRANSLATED.HOW_TO_BUTTON}
        {num}
      </ResourceLink>
    </div>
  </header>

    {TRANSLATED.CRITERION.DESCRIPTION}
    <!-- 
        not all criteria have 'details'; in the data,
        all SCs have a DETAILS object. Only the ones that
        have details will contain one or more objects,
        so if there is DETAILS[1], there are details 
        to display
    -->
    {#if TRANSLATED.CRITERION.DETAILS[1]}
      <button 
        type="button" 
        class="showhidebutton button button-small"
        aria-expanded={criterionDetailsOpen}
        on:click={toggleCriterionDetails}
      >
        {TRANSLATED.SHOW_FULL_DESCRIPTION}
      </button>
      {#if criterionDetailsOpen}
        <ul tabindex="-1" bind:this={criterionDetails}>
          {#each Object.keys(TRANSLATED.CRITERION.DETAILS) as DETAIL}
            <li>
              <p>
                {#if TRANSLATED.CRITERION.DETAILS[DETAIL].TITLE}<strong>{TRANSLATED.CRITERION.DETAILS[DETAIL].TITLE}</strong>:{/if}
                {TRANSLATED.CRITERION.DETAILS[DETAIL].DESCRIPTION}
              </p>
            </li>
          {/each}
        </ul>
      {/if}
    {/if}

  <!--
   * Results for scope
   * assertion.subject === WebSite
   * assertion.result
   * -->
  <EarlResult
    label="{TRANSLATED.SCOPE_RESULT_LEGEND}"
    test="{test}"
    subject="{scopeSubject}"
  />

  {#if $allSamples.length > 0 && $auditSamples.length > 0}
  <details>
    <summary><h4>{TRANSLATED.SAMPLE_RESULTS_DETAILS_BUTTON}</h4></summary>
    <!--
     * Sample results should be generated from
     * (sample) assertions.
     * Assertions should be preferably created at
     * samplePage or sampleInput?
     * Then assertions should be filtered
     * by the selected list of AuditorSamples.
     *
     * Then each assertion => <EarlResult {...assertion} />
   -->
    {#each $allSamples as sample, index (`${num}-${sample.ID}`)}
      {#if $auditSamples.indexOf(sample.ID) >= 0}
        <EarlResult
          label="{TRANSLATED.RESULT_FOR_LABEL}: {sample.title || sample.description || `Sample ${index + 1}`}"
          test="{test}"
          subject="{sample}"
        />
      {/if}
    {:else}
      <p>No sample(s) selected.</p>
    {/each}
  </details>
  {/if}
</div>
<!-- /component -->

<style>  
:global(.criterion:target) {
  outline: 2px solid var(--gold);
}
.criterion-details {
  padding-left: 0;
}
.criterion-details-button {
  margin: .5em 0 1.5em;
}
.criterion__resource-links {
  margin: .5em 0;
}
</style>

<script>
  import { getContext } from 'svelte';

  import { auditSamples } from '@app/stores/auditStore.js';
  import { allSamples } from '@app/stores/sampleStore.js';
  import tests from '@app/stores/earl/testStore/index.js';
  import subjects, {
    TestSubjectTypes
  } from '@app/stores/earl/subjectStore/index.js';

  import EarlResult from '@app/components/form/EarlResult.svelte';
  import ResourceLink from '@app/components/ui/ResourceLink.svelte';
import Acknowledgements from '../../pages/Acknowledgements.svelte';

  export let conformanceLevel;
  export let id;
  export let num;
  export let version = "";
  export let criterionDetailsOpen = false;
  let criterionDetails;

  const { translate, translateToObject } = getContext('app');

  $: TRANSLATED = {
    UNDERSTAND_BUTTON: $translate('PAGES.AUDIT.UNDERSTAND'),
    HOW_TO_BUTTON: $translate('PAGES.AUDIT.HOW_TO'),
    SCOPE_RESULT_LEGEND: $translate('PAGES.AUDIT.SAMPLE_FINDINGS'),
    SAMPLE_RESULTS_DETAILS_BUTTON: $translate('PAGES.AUDIT.BTN_EXPAND_PAGES'),
    RESULT_FOR_LABEL: $translate('PAGES.AUDIT.RESULTS_FOR'),
    CRITERION: $translateToObject('WCAG.SUCCESS_CRITERION')[num],
    SHOW_FULL_DESCRIPTION: $translate('UI.COMMON.SHOW_FULL_DESCRIPTION')
  };

  $: test = $tests.find(($test) => {
    return $test.num === num;
  });

  $: scopeSubject = $subjects.find((subject) => {
    return subject.type.indexOf(TestSubjectTypes.WEBSITE) >= 0;
  });

  function normaliseId(test) {
    return test.num.replaceAll('.','');
  }

  function toggleCriterionDetails() {
    criterionDetailsOpen = !criterionDetailsOpen;
    setTimeout(function() {
      if (criterionDetailsOpen) {
        criterionDetails.focus();
      }
    }, 100);
  }
</script>

<fieldset class="AuditorSamples">
  <legend>
    {TRANSLATED.SAMPLE_SELECT_HEADING}
  </legend>

  <ol class="AuditorSamples__list">
  {#if $allSamples.length > 0 }
    {#each $allSamples as sample, index (sampleID(index))}
      <li class="AuditorSamples__item">
        <input
          id="sample__{sampleID(index)}"
          type="checkbox"
          value="{sample.ID}"
          bind:group="{$auditSamples}"
        />
        <label
          for="sample__{sampleID(index)}"
        >{sample.title || sample.description || $translate('PAGES.SAMPLE.SAMPLE_PAGE') + " " + sampleID(index)}
          {#if sample.completed}
            <span
              class="visuallyhidden"
            >{TRANSLATED.SAMPLE_SELECT_TESTED}</span>
          {/if}
        </label>
        {#if isURL(sample.description)}
          <a class="AuditorSamples__link" href="{sample.description}" aria-label={sample.title}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="1em" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              aria-hidden="true"
              role="presentation"
              focusable="false"
              stroke-linecap="round" 
              stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
          </a>
        {/if}
    </li>
    {/each}
    <div class="AuditorSamples__select-all">
      <input
        id="AuditorSamples__multiselect"
        type="checkbox"
        indeterminate="{someChecked}"
        checked="{allChecked}"
        on:change="{handleMultiselectClick}"
      />
      <label
        for="AuditorSamples__multiselect"
      >{TRANSLATED.SAMPLE_SELECT_LABEL_SELECT_ALL}</label>
    </div>
  {:else}
    <div class="AuditorSamples__empty">{TRANSLATED.SAMPLE_SELECT_NO_SAMPLE}</div>
  {/if}
</fieldset>

<style media="screen">
  .AuditorSamples__list {
    padding: 0;
    margin: 0;
  }
  .AuditorSamples__item {
    list-style: none;
    display: flex;
    flex-wrap: nowrap;
    align-items: start;
  }
  .AuditorSamples__item label {
    margin-left: .5em;
  }
  .AuditorSamples__item input {
    width: 1em;
    height: 1em;
    flex: none;
  }
  .AuditorSamples__select-all {
    margin-top: 1em;
  }
  .AuditorSamples__link {
    vertical-align: middle;
    margin-left: .25em;
  }
  legend {
    font-size: 1rem;
  }
</style>

<script>
  import { getContext } from 'svelte';

  import { auditSamples } from '@app/stores/auditStore.js';
  import { allSamples } from '@app/stores/sampleStore.js';

  const { translate } = getContext('app');

  $: TRANSLATED = {
    SAMPLE_SELECT_HEADING: $translate('PAGES.AUDIT.HD_SAMPLE_SELECT'),
    SAMPLE_SELECT_INFO: $translate('PAGES.AUDIT.INF_AUDIT_SAMPLE'),
    SAMPLE_SELECT_LABEL_SELECT_ALL: $translate('PAGES.AUDIT.SELECT_ALL'),
    SAMPLE_SELECT_BUTTON_COMPLETE_SELECTED: $translate('PAGES.AUDIT.BTN_COMPLETE_SELECTED'),
    SAMPLE_SELECT_BUTTON_UNCOMPLETE_SELECTED: $translate('PAGES.AUDIT.BTN_UNCOMPLETE_SELECTED'),
    SAMPLE_SELECT_BUTTON_OPEN_SELECTED: $translate('PAGES.AUDIT.BTN_OPEN_SELECTED'),
    SAMPLE_SELECT_TESTED: $translate('PAGES.AUDIT.TESTED'),
    SAMPLE_SELECT_NO_SAMPLE: $translate('PAGES.AUDIT.NO_SAMPLE')
  };

  $: allSampleIDs = $allSamples.map((sample) => sample.ID);
  $: allChecked = allSampleIDs.length === $auditSamples.length;
  $: someChecked = !allChecked && $auditSamples.length > 0;

  function sampleID(index) {
    return parseInt(index, 10) + 1;
  }

  function isURL(value) {
    try {
      return new URL(value);
    } catch (e) {
      return false;
    }
  }

  function handleMultiselectClick() {
    $auditSamples = [];

    if (!allChecked) {
      $auditSamples = allSampleIDs;
    }
  }
</script>

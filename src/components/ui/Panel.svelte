<aside class="Panel your-report" class:your-report--expanded="{$yourReportPanelOpen}" class:your-report--collapsed="{!$yourReportPanelOpen}">
  {#if $yourReportPanelOpen}
  <h2 class="Panel__Header__heading your-report__heading">
    {#if subtitle}
    <div>
      <span class="your-report__heading-pre">{subtitle}</span>
      {title}
    </div>
    {:else}
      {title}
    {/if}

    <button
      type="button"
      class="button-secondary button-small your-report__showhide"
      on:click={toggle}
      aria-expanded="{$yourReportPanelOpen}"
    >
      {@html TRANSLATED.SHOW_HIDE}
      <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
    </button>
  </h2>

  <slot />

  {:else}
    <button
      type="button"
      class="button-secondary button-small your-report__showhide"
      on:click={toggle}
      aria-expanded="{$yourReportPanelOpen}"
    >
      <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      {@html TRANSLATED.SHOW_HIDE}
    </button>
  {/if}
</aside>

<style>
.your-report {
  position: sticky;
  top: 1em;
  grid-row-start: 1;
}
:global(#report-findings .your-report {
  position: static;
})
.your-report__heading-pre {
  font-size: smaller;
  display: block;
}
.your-report__showhide[aria-expanded="false"] svg {
  margin-right: .25em;
  margin-left: 0;
}
.your-report--collapsed {
  float: right;
}
</style>

<script>
  import { getContext } from 'svelte';
  import { yourReportPanelOpen } from '@app/stores/appStore.js';

  export let title = null;
  export let subtitle = null;

  const { translate } = getContext('app');

  $: fullTitle = subtitle ? `${subtitle} ${title}` : title;

  $: TRANSLATED = {
    SHOW_HIDE: $yourReportPanelOpen
      ? $translate('UI.COMMON.BUTTON.HIDE', {
          default: 'Hide {subject}',
          values: { subject: `<span class="visuallyhidden">${fullTitle || ''}</span>` }
        })
      : $translate('UI.COMMON.BUTTON.SHOW', {
          default: 'Show {subject}',
          values: { subject: fullTitle || '' }
        })
  };

  function toggle() {
    yourReportPanelOpen.set(!$yourReportPanelOpen);
  }
</script>

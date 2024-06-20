<svelte:head>
  <title>{title} | WCAG-EM Report Tool</title>
</svelte:head>

<div class="page-content" id="{pageid}">
{#if needsPanelSpace}
  <div class="default-grid">
    <main class="main-with-panel">
      <h1>{title}</h1>
      {#if currentLocale.status === "draft"}
          <section id="translation-info" class="doc-note-translation" lang="en">
            <h2 class="visuallyhidden">{TRANSLATED.TRANSLATION_ABOUT}</h2>
            <p>{@html TRANSLATED.TRANSLATION_DRAFT}</p>
            {#if currentLocale.wcagStatus === "unofficial"}
              <p>{@html TRANSLATED.TRANSLATION_UNOFFICIAL}</p>
            {/if}
            <p>{@html TRANSLATED.TRANSLATION_ACK}</p>
          </section>
      {/if}
      <slot />
    </main>
    <YourReport />
  </div>
{:else}
  <div class="default-grid">
    <main class="main-without-panel">
      {#if !isViewReport && !isOverview && !isAcknowledgements}
      <YourReport />
      {/if}
      <h1>{title}</h1>
      {#if currentLocale.status === "draft"}
          <section id="translation-info" class="doc-note-translation" lang="en">
            <h2 class="visuallyhidden">{TRANSLATED.TRANSLATION_ABOUT}</h2>
            <p>{@html TRANSLATED.TRANSLATION_DRAFT}</p>
            {#if currentLocale.wcagStatus === "unofficial"}
              <p>{@html TRANSLATED.TRANSLATION_UNOFFICIAL}</p>
            {/if}
            <p>{@html TRANSLATED.TRANSLATION_ACK}</p>
          </section>
      {/if}
      <slot />
    </main>
  </div>
{/if}
</div>

<style>
  .page-content {
    padding: 2em 0;
  }
  .main-with-panel {
    grid-column: 2 / 8;
  }
  .main-without-panel {
    grid-column: 2 / 10;
  }
  :global(main > *:not(:last-child)) {
    margin-bottom: 1em;
  }
</style>

<script>
  import { onMount, getContext } from "svelte";
  import { useLocation } from 'svelte-navigator';
  import { honourFragmentIdLinks } from '@app/scripts/honourFragmentIdLinks.js';
  import { locale } from 'svelte-i18n';

  import locales from '@app/locales/index.json';
  $: currentLocale = locales.find((l) => l.lang === $locale);

  import { routes, yourReportPanelOpen } from '@app/stores/appStore.js';

  import YourReport from '@app/components/ui/YourReport.svelte';

  const location = useLocation();

  export let pageid;

  $: isViewReport = $location.pathname === $routes.VIEW_REPORT.path;
  $: isOverview = $location.pathname === $routes.OVERVIEW.path;
  $: isAcknowledgements = $location.pathname === $routes.ACKNOWLEDGEMENTS.path;
  $: needsPanelSpace = !isViewReport && !isOverview && !isAcknowledgements && $yourReportPanelOpen;

  onMount(() => {
    setTimeout(honourFragmentIdLinks($location), 100);
  });

  export let title;

  const { translate } = getContext('app');

  $: TRANSLATED = {
    TRANSLATION_ABOUT: $translate('UI.COMMON.TRANSLATION_ABOUT'),
    TRANSLATION_DRAFT: $translate('UI.COMMON.TRANSLATION_DRAFT'),
    TRANSLATION_ACK: $translate('UI.COMMON.TRANSLATION_ACK'),
    TRANSLATION_UNOFFICIAL: $translate('UI.COMMON.TRANSLATION_UNOFFICIAL'),
  };

</script>

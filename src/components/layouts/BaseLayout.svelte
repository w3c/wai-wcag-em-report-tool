<!-- @Layout:Base -->
<div class="Controls default-grid">
  <LanguageSelect locales="{locales}" />
</div>

<div id="site-header" class="site-header">
  <div class="default-grid">
    <div class="tool-header">
      <div class="tool-header-name">
        WCAG-EM R<span class="display-phablet">eport </span>T<span class="display-phablet">ool</span>
      </div>
      <div class="tool-header-logo">
        <a href="http://w3.org/"><img
            alt="W3C"
            src="images/w3c.svg"
          /></a>
        <a href="http://w3.org/WAI/"><img
            alt="Web Accessibility Initiative"
            src="images/wai.svg"
          /></a>
      </div>
    </div>
  </div>
</div>

<NavigationBar />

<slot />

{#if !isAcknowledgements}
<Pager label="{TRANSLATED.STEP}" context="{pagerContext}" />
{/if}

<!-- /@Layout -->

<style>
  .site-header .tool-header {
    grid-column: 2 / 10;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .BaseLayout {
    padding: 2em 1em;
  }

  .Controls {
    font-size: 0.8125em;
  }

  @media (min-width: 60em) {
    .BaseLayout {
      padding: 2em 0;
    }
  }
</style>

<script>
  import { getContext } from 'svelte';
  import { useLocation } from 'svelte-navigator';

  import { routes } from '@app/stores/appStore.js';
  import locales from '@app/locales/index.json';

  import LanguageSelect from '@app/components/ui/LanguageSelect.svelte';
  import NavigationBar from '@app/components/ui/NavigationBar.svelte';
  import Pager from '@app/components/ui/Pager.svelte';

  const { translate } = getContext('app');
  const location = useLocation();

  $: TRANSLATED = {
    STEP: $translate('UI.NAV.STEP', { default: 'step' }),
  };

  $: isAcknowledgements = $location.pathname === $routes.ACKNOWLEDGEMENTS.path;

  $: pagerContext = Object.keys($routes).map((key) => {
    return $routes[key];
  });  
</script>

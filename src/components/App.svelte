<!--
  * This file should be used to arange the base of the App.
  * If the app needs configuration, this can be passed on
  * from the main file '@app/main.js' and passed as props.
  * e.g.:
  *   new App({
  *     ...
  *     props: {
  *       settings,
  *       theme,
  *       hacks,
  *       etc
  *     }
  *     ...
  *   });
  *
  * In here, App.svelte, they would then be accessed like props:
  * e.g.:
  *   export let settings;
  *   export let theme;
  *   export let hacks;
  *   export let etc;
  *
  *   or $$otherProps
  *
  *   and passed on to the app context; setContext('app', {...})
  *   where components can access them with: const {...} = getContext('app');
  * -->

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
  import { outcomeValueStore } from '@app/stores/earl/resultStore/index.js';

  import BaseRoute from '@app/components/routes/BaseRoute.svelte';

  export let basepath = '/';

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
    wcagCriteria: wcagStore
  });

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
    window.addEventListener("input", setInteracted);
  });
  function setInteracted(){
      window.removeEventListener("input", setInteracted);
      //set some var to notify us of user changes
      window.onbeforeunload = closeEditorWarning;
  }
  function closeEditorWarning(){
    return 'Are you sure?'
  }



</script>

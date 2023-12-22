<!-- @Layout:Evaluation -->
<slot />
<!-- /@Layout -->

<script>
  import { getContext, onDestroy, onMount, setContext } from 'svelte';
  import {
    outcomeValueStore,
    impactValueStore
  } from '@app/stores/earl/resultStore/index.js';
  import subjects, {
    TestSubjectTypes
  } from '@app/stores/earl/subjectStore/index.js';
  import wcag from '@app/stores/wcagStore.js';

  const { scopeStore } = getContext('app');
  // Initialize

  // Create a WebSite subject
  let websiteSubject =
    $subjects.find((subject) => {
      return subject.type.indexOf(TestSubjectTypes.WEBSITE) >= 0;
    }) ||
    subjects.create({
      type: TestSubjectTypes.WEBSITE
    });

  let endSubscription;

  $: {
    websiteSubject.title = $scopeStore['SITE_NAME'];
    websiteSubject.description = $scopeStore['WEBSITE_SCOPE'];
  }

  setContext('Evaluation', {
    outcomeValues: outcomeValueStore,
    impactValues: impactValueStore,
    wcagCriteria: wcag
  });

  onMount(() => {
    // Stores that need to be up-to-date in background
    endSubscription = (() => {
      const unscribeOutcomeStore = outcomeValueStore.subscribe(() => {});
      const unscribeImpactStore = impactValueStore.subscribe(() => {});
      const unscribeWcag = wcag.subscribe(() => {});

      return () => {
        unscribeOutcomeStore();
        unscribeImpactStore();
        unscribeWcag();
      };
    })();
  });

  onDestroy(() => {
    endSubscription();
  });
</script>

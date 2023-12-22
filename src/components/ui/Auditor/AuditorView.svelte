<div class="AuditorView">
  {#each [...principles] as principle}
    <details open>
      <summary>
        <h2
          id="{`principle-${TRANSLATED.PRINCIPLES[principle].TITLE.toLowerCase()}`}"
        >
          {principle}
          {TRANSLATED.PRINCIPLES[principle].TITLE}
        </h2>
      </summary>
      {#each [...guidelines].filter((g) => g.indexOf(principle) === 0) as guideline}
        <details open>
          <summary>
            <h3>{guideline} {TRANSLATED.GUIDELINES[guideline].TITLE}</h3>
          </summary>
          <!--
           * Should filter assertions based on test prop;
           * assertion.test.num in case of wcag.
           * Specificly test.num.indexOf guideline === 0
           * because we are grouping per principle > guideline.
           * -->
          {#each criteria.filter((criterion) => criterion.num.indexOf(guideline) === 0) as criterion (criterion.num)}
            <div class="Auditor__Assertion">
              <!--
               * This should probably not be called an assertion
               * We do target a certain group of assertions,
               * but we are displaying a complex testView based on multiple assertions;
               * This one specificly shows all assertions:
               * 1. that are tested agains one specific type of test
               * 2. and contain website results shown first
               * 3. followed by webpage specific results
               *
               * proposed:
               * - AuditView / AuditorView,
               *   with props possibly
               *
               *   - collection? The assertions to pass through.
               *   - groupby?
               *     To create one or multiple expandable groups?
               *     values should be picked from collection item props
               *     eg: <AuditorView collection="{$assertions}" groupby="test subject" />
               *
               *
               *   May be slotted? To use as a template of some sorts?
               *   eg:
               *    <AuditorView collection="{$assertions}" let:slotprop={assertion}>
               *      <div>{assertion.subject}</div>
               *    </AuditorView>
               *
               *
               * -->
              <Criterion {...criterion} />
            </div>
          {/each}
        </details>
      {/each}
    </details>
  {:else}
    <p>No criteria, use the filter to show some criteria.</p>
  {/each}
</div>

<style>
  .Auditor__Assertions {
    margin-left: -2rem;
  }
</style>

<script>
  import { getContext } from 'svelte';

  import Criterion from './Criterion.svelte';

  export let criteria = [];

  const { translateToObject } = getContext('app');

  $: TRANSLATED = {
    PRINCIPLES: $translateToObject('WCAG.PRINCIPLE'),
    GUIDELINES: $translateToObject('WCAG.GUIDELINE')
  };

  // Sets are unique values
  $: principles = new Set(criteria.map((a) => a.num.split('.')[0]));
  $: guidelines = new Set(
    criteria.map((a) => {
      const splittedNum = a.num.split('.');

      return `${splittedNum[0]}.${splittedNum[1]}`;
    })
  );
</script>

<h4>{TRANSLATED.OUTCOME}</h4>
{#each CONFORMANCE_LEVELS as conformanceLevel, index}
  {#if index <= CONFORMANCE_LEVELS.indexOf(conformanceTarget)}
    <h5>{`${TRANSLATED.LABEL_LEVEL} ${conformanceLevel}`}</h5>
    <ul class="result-cards">
      {#each resultsByCategory as category}
        <ResultCard
          label="{category.name}"
          items="{category.items.filter(({ test }) => test.conformanceLevel === conformanceLevel)}"
        />
      {/each}
    </ul>
  {/if}
{/each}

<style>
  ul {
    margin: 0;
    padding: 0;
  }
  .result-cards {
    display: flex;
    justify-content: space-around;
    flex-flow: wrap;
    background-color: var(--off-white);
    border-radius: 0.5em;
  }
</style>

<script>
  import { getContext } from 'svelte';
  import ResultCard from './ResultCard.svelte';

  import assertions from '@app/stores/earl/assertionStore/index.js';
  import { TestSubjectTypes } from '@app/stores/earl/subjectStore/index.js';
  import { CriteriaSelected } from '@app/stores/selectedCriteriaStore.js';
  import { CONFORMANCE_LEVELS } from '@app/stores/wcagStore.js';

  const { translateToObject, translate, scopeStore } = getContext('app');
  const { outcomeValues } = getContext('Evaluation');

  $: TRANSLATED = {
    CRITERIA: $translateToObject('WCAG.SUCCESS_CRITERION'),
    OUTCOME: $translate('UI.REPORT.OUTCOME'),
    LABEL_LEVEL: $translate('UI.REPORT.LABEL_LEVEL')
  };

  $: conformanceTarget = $scopeStore['CONFORMANCE_TARGET'];
  $: resultsByCategory = $outcomeValues.reduce(function (final, outcomeValue) {
    let totalEvaluated = 0;
    if ($assertions.length == 0 && outcomeValue.id == 'earl:untested') {
      const value = {
        name: outcomeValue.title,
        id: outcomeValue.id,
        items: $CriteriaSelected
      };
      final.push(value);
    } else if (outcomeValue.id == 'earl:untested') {
      const value = {
        name: outcomeValue.title,
        id: outcomeValue.id,
        items: $assertions.filter(
          (assertion) =>
            assertion.result.outcome.id === outcomeValue.id &&
            assertion.subject.type.indexOf(TestSubjectTypes.WEBSITE) >= 0
        )
      };
      final.push(value);
    } else {
      const value = {
        name: outcomeValue.title,
        id: outcomeValue.id,
        items: $assertions.filter(
          (assertion) =>
            assertion.result.outcome.id === outcomeValue.id &&
            assertion.subject.type.indexOf(TestSubjectTypes.WEBSITE) >= 0
        )
      };
      final.push(value);
    }
    return final;
  }, []);
</script>

<h4>{TRANSLATED.POUR}</h4>
{#each principles as principle}
  <h5>{TRANSLATED.PRINCIPLES[principle].TITLE}</h5>
  <p>
    {$translate(`${TRANSLATED.PRINCIPLES[principle].RESULT_DESCRIPTION}`, {
      values: {
        count: getItems(failedResults, principle).length,
        totalCount: getTotalItems(principle),
        percentage: getPercentage(failedResults, principle)
      }
    })}
  </p>
  <ul class="result-cards">
    {#each resultsByCategory as category}
      <PrincipleResultCard
        label="{category.name}"
        items="{getItems(category, principle)}"
        totalItems="{getTotalItems(principle)}"
      />
    {/each}
  </ul>
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
  p {
    max-width: none;
  }
</style>

<script>
  import { getContext } from 'svelte';

  import assertions from '@app/stores/earl/assertionStore/index.js';
  import { TestSubjectTypes } from '@app/stores/earl/subjectStore/index.js';
  import { CriteriaSelected } from '@app/stores/selectedCriteriaStore.js';
  import { wcag } from '@app/stores/wcagStore.js';
  import PrincipleResultCard from './PrincipleResultCard.svelte';

  const { translateToObject, translate } = getContext('app');
  const { outcomeValues } = getContext('Evaluation');

  $: TRANSLATED = {
    POUR: $translate('UI.REPORT.POUR'),
    PRINCIPLES: $translateToObject('WCAG.PRINCIPLE'),
    CRITERIA: $translateToObject('WCAG.SUCCESS_CRITERION'),
    OUTCOME: $translate('UI.REPORT.OUTCOME')
  };
  $: principles = [...new Set($wcag.map((a) => a.num.split('.')[0]))];
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

  $: failedResults = resultsByCategory.find(({ id }) => id === 'earl:failed');

  // conformance levels in the result set only (so based on selected WCAG version)
  $: relevantConformanceLevels = [
    ...new Set(
      resultsByCategory
        .map(({ items }) => items)
        .flat()
        .map(({ test }) => test?.conformanceLevel)
    )
  ];

  function getItems(category, principle) {
    return category.items.filter(({ test }) =>
      test?.num.startsWith(`${principle}.`)
    );
  }

  function getTotalItems(principle) {
    return $wcag.filter(
      ({ num, conformanceLevel }) =>
        num.startsWith(`${principle}.`) &&
        relevantConformanceLevels.includes(conformanceLevel)
    ).length;
  }

  function getPercentage(category, principle) {
    return Math.round(
      (getItems(category, principle).length / getTotalItems(principle)) * 100
    );
  }
</script>

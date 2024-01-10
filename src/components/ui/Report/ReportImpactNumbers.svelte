<h4>{TRANSLATED.IMPACT}</h4>
<ul class="result-cards">
  {#each resultsByImpact as impact}
    <ResultCard label="{impact.name}" items="{impact.items}" />
  {/each}
</ul>

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
  let criteriaCount = 0;
  $: criteriaCount = $CriteriaSelected.length;

  const { translateToObject, translate } = getContext('app');
  const { impactValues } = getContext('Evaluation');

  $: TRANSLATED = {
    CRITERIA: $translateToObject('WCAG.SUCCESS_CRITERION'),
    IMPACT: $translate('UI.REPORT.IMPACT')
  };

  $: resultsByImpact = $impactValues.reduce(function (final, impactValue) {
    let totalEvaluated = 0;
    if ($assertions.length == 0 && impactValue.id == 'earl:noImpact') {
      const value = {
        name: impactValue.title,
        id: impactValue.id,
        items: $CriteriaSelected
      };
      final.push(value);
    } else if (impactValue.id == 'earl:noImpact') {
      const value = {
        name: impactValue.title,
        id: impactValue.id,
        items: $assertions.filter(
          (assertion) =>
            assertion.result.impact.id === impactValue.id &&
            assertion.subject.type.indexOf(TestSubjectTypes.WEBSITE) >= 0
        )
      };
      final.push(value);
    } else {
      const value = {
        name: impactValue.title,
        id: impactValue.id,
        items: $assertions.filter(
          (assertion) =>
            assertion.result.impact.id === impactValue.id &&
            assertion.subject.type.indexOf(TestSubjectTypes.WEBSITE) >= 0
        )
      };
      final.push(value);
    }
    return final;
  }, []);
</script>

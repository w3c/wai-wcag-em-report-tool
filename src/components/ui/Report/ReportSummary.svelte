<ReportNumbers criteria="{criteriaCount}" />

<h4>{TRANSLATED.IMPACT}</h4>
<ul class="result-cards">
  {#each resultsByImpact as impact}
    <ResultCard label="{impact.name}" items="{impact.items}" />
  {/each}
</ul>

<h4>{TRANSLATED.OUTCOME}</h4>
<ul class="result-cards">
  {#each resultsByCategory as category}
    <ResultCard label="{category.name}" items="{category.items}" />
  {/each}
</ul>
{#if resultsByCategory[4].items.length > 0 && assertions.length > 0}
  <details>
    <summary>
      <h3>{resultsByCategory[4].name} ({resultsByCategory[4].items.length})</h3>
    </summary>
    <ul class="result-missing">
      {#each resultsByCategory[4].items as item}
        <li>
          <Link
            to="{`/evaluation/audit-sample#criterion-${normaliseId(item)}`}"
          >
            {item.test.num}: {TRANSLATED.CRITERIA[item.test.num].TITLE}
          </Link>
        </li>
      {/each}
    </ul>
  </details>
{/if}

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
  @media (min-width: 60em) {
    .result-missing {
      column-count: 2;
    }
  }
</style>

<script>
  import { getContext } from 'svelte';
  import { Link } from 'svelte-navigator';
  import ReportNumbers from './ReportNumbers.svelte';
  import ResultCard from './ResultCard.svelte';

  import assertions from '@app/stores/earl/assertionStore/index.js';
  import subjects, {
    TestSubjectTypes
  } from '@app/stores/earl/subjectStore/index.js';
  import { CriteriaSelected } from '@app/stores/selectedCriteriaStore.js';
  let criteriaCount = 0;
  $: criteriaCount = $CriteriaSelected.length;

  const { translateToObject, translate } = getContext('app');
  const { outcomeValues, impactValues } = getContext('Evaluation');

  $: TRANSLATED = {
    CRITERIA: $translateToObject('WCAG.SUCCESS_CRITERION'),
    IMPACT: $translate('UI.REPORT.IMPACT'),
    OUTCOME: $translate('UI.REPORT.OUTCOME')
  };

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
    console.log('final', final);

    return final;
  }, []);

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

  function normaliseId(item) {
    return item.test.num.replaceAll('.', '');
  }
</script>

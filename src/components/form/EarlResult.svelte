<!--
 * EarlResult
 *
 * use like:
 *   <EarlResult {...assertion} />
 *
 * Where assertion should be like
 * an earl:Assertion object picked from
 * the assertionStore: $assertions.
 *
 * Important here is to pass the correct result,
 * so test AND subject should always match.
 * -->
<fieldset class="Criterion__Result">
  <legend class="Criterion__Subject">
    {#if label}
      {label}
    {:else}
      {$translate('PAGES.AUDIT.RESULTS_FOR')}: {subject.title || subject.description || `subject ${subject.ID}`}
    {/if}
  </legend>

  <div class="Criterion__Fields">
    <Select
      id="{`assertion__${_assertion.ID}--result__outcome`}"
      label="{$translate('PAGES.AUDIT.LABEL_OUTCOME')}"
      options="{outcomeOptions}"
      value="{_assertion.result.outcome.id}"
      on:change="{handleOutcomeChange}"
    />
    <Select
      id="{`assertion__${_assertion.ID}--result__impact`}"
      label="{$translate('PAGES.AUDIT.LABEL_IMPACT')}"
      options="{impactOptions}"
      value="{_assertion.result.impact.id}"
      on:change="{handleImpactChange}"
    />

    <Textarea
      id="{`assertion__${_assertion.ID}--result__description`}"
      label="{$translate('PAGES.AUDIT.ASSERTION_RESULT_DESCRIPTION_LABEL')}"
      bind:value="{_assertion.result.description}"
      on:change="{handleResultChange}"
      className="Criterion__Observation"
    >
      <span slot="after-textarea" class="view-in-report">
        <Link
          to="{`/evaluation/view-report#criterion-${_assertion.test.num.replaceAll('.', '')}`}"
        >
          {TRANSLATED.VIEW_IN_REPORT}
        </Link>
      </span>
    </Textarea>
  </div>
</fieldset>

<style>
  .Criterion__Result {
    display: block;
    border: none;
    margin: 1em 0 0;
  }

  .Criterion__Subject {
    padding: 0;
    font-size: 1em;
    overflow-wrap: anywhere;
  }
  .Criterion__Fields {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
  .view-in-report {
    order: -1;
    text-align: right;
  }
  /* the following selectors are overly specific for cascading reasons */
  :global(.Criterion__Fields :last-child) {
    flex: 2;
  }
  :global(div.Criterion__Fields .Field:last-child label) {
    order: -2;
  }
  :global(div.Criterion__Fields div.Field.Criterion__Observation) {
    flex-direction: row;
    flex-wrap: wrap;
  }
  @media (min-width: 60em) {
    .Criterion__Fields {
      flex-direction: row;
      gap: 2rem;
    }
  }
</style>

<script>
  /**
   * This is a result that belongs to an Assertion
   * The assertion required should match:
   * - subject
   * - test
   */

  import { getContext } from 'svelte';
  import { Link } from 'svelte-navigator';

  import assertions from '@app/stores/earl/assertionStore/index.js';

  import Select from '@app/components/form/Select.svelte';
  import Textarea from '@app/components/form/Textarea.svelte';

  import { CriteriaSelected } from '@app/stores/selectedCriteriaStore.js';

  export let label = undefined;
  // Used to display subject.title
  export let subject = {};

  // Used for id creation (test.id)
  export let test = {};

  const { translate } = getContext('app');
  const { outcomeValues, impactValues } = getContext('Evaluation');

  console.log(outcomeOptions, impactOptions);

  $: TRANSLATED = {
    VIEW_IN_REPORT: $translate('PAGES.AUDIT.VIEW_IN_REPORT')
  };

  $: outcomeOptions = $outcomeValues.map((outcomeValue, index) => {
    const title = outcomeValue.title;
    const value = outcomeValue.id;

    return {
      title,
      value,
      selected: index === $outcomeValues.length - 1
    };
  });

  $: impactOptions = $impactValues.map((impactValue, index) => {
    const title = impactValue.title;
    const value = impactValue.id;

    return {
      title,
      value,
      selected: index === $impactValues.length - 1
    };
  });

  // Get or create an Assertion
  $: _assertion =
    $assertions.find(($assertion) => {
      const matchedTest = $assertion.test.num === test.num;
      const matchedSubject = $assertion.subject === subject;

      return matchedTest && matchedSubject;
    }) || assertions.create({ subject, test });

  function handleOutcomeChange(event) {
    const value = event.target.value;
    _assertion.result.outcome = $outcomeValues.find((outcomeValue) => {
      return outcomeValue.id === value;
    });

    _assertion.result.setDate();
    assertions.update(() => $assertions);
  }

  function handleImpactChange(event) {
    const value = event.target.value;
    _assertion.result.impact = $impactValues.find((impactValue) => {
      return impactValue.id === value;
    });

    _assertion.result.setDate();
    assertions.update(() => $assertions);
  }

  function handleResultChange() {
    _assertion.result.setDate();
    assertions.update(() => $assertions);
  }
</script>

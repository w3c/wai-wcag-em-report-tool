<Panel title="{siteName || TRANSLATED.HEADING_PANEL}" subtitle="{siteName ? TRANSLATED.REPORT_FOR : ''}">
  {#if totalEvaluated > 0 || !isOverview}
    <ReportNumbers criteria={criteriaCount}></ReportNumbers>

    <ProgressBar percentage={percentageTotalEvaluated}></ProgressBar>
    
    <ul class="your-report__progress-by-principle">
      {#each principles as principle}
      <li class="progress">
        <div class="progress__principle">
          {#if isAuditSample}
          <a href={`#principle-${TRANSLATED.PRINCIPLES[principle].TITLE.toLowerCase()}`} class="principle__name">
            <span>{TRANSLATED.PRINCIPLES[principle].TITLE}</span>
          </a>
          {:else}
          <Link to={`/evaluation/audit-sample#principle-${TRANSLATED.PRINCIPLES[principle].TITLE.toLowerCase()}`} class="principle__name">
            <span>{TRANSLATED.PRINCIPLES[principle].TITLE}</span>
          </Link>
          {/if} 
          <span class="progress__part">{totalsPerPrinciple[principle]["done"]} {TRANSLATED.OF} {totalsPerPrinciple[principle]["total"]}</span>
        </div>
        <ProgressBar percentage="{totalsPerPrinciple[principle]["percentage"]}"></ProgressBar>
      </li>
      {/each}
    </ul>
    
    <Link class="button" to="/evaluation/view-report">
      {TRANSLATED.VIEW_REPORT}
    </Link>
    {#if $interacted == true}
    <Button type="secondary" on:click={handleClearEvaluationClick}>
      {TRANSLATED.CLEAR_REPORT}
    </Button>
    {/if}
  {:else}
    <p>{TRANSLATED.NOT_STARTED}</p>
    <Button on:click="{handleNewEvaluationClick}">
      {TRANSLATED.BUTTON_NEW_EVALUATION}
    </Button>
    <OpenEvaluation />
  {/if}
</Panel>

<style>  
.your-report__progress-by-principle {
  columns: 1;
}
:global(.your-report .button + .File),
:global(.your-report .button + .button) { 
  margin-top: 4px; 
}
</style>

<script>
  import { getContext, onMount } from 'svelte';
  import { Link, useNavigate, useLocation } from 'svelte-navigator';

  import Panel from '@app/components/ui/Panel.svelte';
  import ProgressBar from '@app/components/ui/ProgressBar.svelte';
  import ReportNumbers from '@app/components/ui/Report/ReportNumbers.svelte';
  import OpenEvaluation from '@app/components/form/OpenEvaluation.svelte';
  import Button from '@app/components/ui/Button.svelte';

  import { wcag, scopedWcagVersions } from '@app/stores/wcagStore.js';
  import { routes } from '@app/stores/appStore.js';
  import assertions from '@app/stores/earl/assertionStore/index.js';
  import evaluationStore from '@app/stores/evaluationStore.js';

  import subjects, { TestSubjectTypes } from '@app/stores/earl/subjectStore/index.js';
  import { CriteriaSelected } from '@app/stores/selectedCriteriaStore.js';
  let criteriaCount = 0;
  $: criteriaCount = $CriteriaSelected.length;

  import { interacted } from '@app/stores/interactedStore.js';
  
  const navigate = useNavigate();
  const location = useLocation();
  const { translate, translateToObject, scopeStore } = getContext('app');

  $: TRANSLATED = {
    BUTTON_NEW_EVALUATION: $translate('UI.NAV.MENU_NEW', {
      default: 'Start new report'
    }),
    PRINCIPLES: $translateToObject('WCAG.PRINCIPLE'),
    HEADING_PANEL: $translate('UI.COMMON.YOUR_REPORT', {
      default: 'Your report'
    }),
    STEP: $translate('UI.NAV.STEP', { default: 'step' }),
    VIEW_REPORT: $translate('UI.NAV.VIEWREPORT', {
      default: 'View report'
    }),
    CLEAR_REPORT: $translate('UI.NAV.CLEARREPORT', {
      default: 'Clear report'
    }),
    CLEAR_WARNING: $translate('UI.NAV.CLEARWARNING'),
    NOT_STARTED: $translate('UI.NAV.NOT_STARTED'),
    CONFORMANCE_LEVEL: $translate('WCAG.COMMON.CONFORMANCE_LEVEL'),
    REPORT_FOR: $translate('UI.REPORT.REPORT_FOR'),
    OF: $translate('UI.REPORT.REPORTED_ON_OF'),
  };

  $: conformanceTarget = $scopeStore['CONFORMANCE_TARGET'];
  $: percentageTotalEvaluated = 100 / $CriteriaSelected.length * totalEvaluated;

  $: principles = [...new Set($wcag.map((a) => a.num.split('.')[0]))];

  $: filteredCriteria = {
   1: $CriteriaSelected.filter(item => item.num.startsWith("1.")).filter(isInScope) || {},
   2: $CriteriaSelected.filter(item => item.num.startsWith("2.")).filter(isInScope) || {},
   3: $CriteriaSelected.filter(item => item.num.startsWith("3.")).filter(isInScope) || {},
   4: $CriteriaSelected.filter(item => item.num.startsWith("4.")).filter(isInScope) || {}
  };

  $: filteredAssertions = {
   1: $assertions.filter(item => item.test.num.startsWith("1.")).filter(isEvaluated),
   2: $assertions.filter(item => item.test.num.startsWith("2.")).filter(isEvaluated),
   3: $assertions.filter(item => item.test.num.startsWith("3.")).filter(isEvaluated),
   4: $assertions.filter(item => item.test.num.startsWith("4.")).filter(isEvaluated)
  }

  $: totalsPerPrinciple = {
    1: {
      "done": filteredAssertions[1].length,
      "total": filteredCriteria[1].length,
      "percentage": (filteredAssertions[1].length / filteredCriteria[1].length) * 100
    },
    2: {
      "done": filteredAssertions[2].length,
      "total": filteredCriteria[2].length,
      "percentage": (filteredAssertions[2].length / filteredCriteria[2].length) * 100
    },
    3: {
      "done": filteredAssertions[3].length,
      "total": filteredCriteria[3].length,
      "percentage": (filteredAssertions[3].length / filteredCriteria[3].length) * 100
    },
    4: {
      "done": filteredAssertions[4].length,
      "total": filteredCriteria[4].length,
      "percentage": (filteredAssertions[4].length / filteredCriteria[4].length) * 100
    },    
  }

  function isInScope(wcagSC) {
    return  wcagSC.conformanceLevel.length <= conformanceTarget.length && conformanceTarget.length &&  $scopedWcagVersions.includes(wcagSC.version)
  };

  function isEvaluated(assertion) {
    return assertion.result.outcome.id !== "earl:untested" && assertion.subject.type.indexOf(TestSubjectTypes.WEBSITE) >= 0
  }

  function handleNewEvaluationClick() {
    $evaluationStore.reset();
    navigate($routes.SCOPE.path, { replace: true });
  }

  function handleClearEvaluationClick() {
    var clearResult = window.confirm(TRANSLATED.CLEAR_WARNING);
    if(clearResult){
      $evaluationStore.reset();
      $interacted = false;
      navigate($routes.SCOPE.path, { replace: true });
    }
  }

  onMount(() => {
    window.addEventListener("input", setInteracted);
  });
  function setInteracted(e){
      if(e.target.type != "file"){
        window.removeEventListener("input", setInteracted);
        $interacted = true;
      }
  }

  $: isOverview = $location.pathname === $routes.OVERVIEW.path; 
  $: isAuditSample = $location.pathname === $routes.AUDIT.path; 
  $: siteName = $scopeStore['SITE_NAME'];
  $: totalToEvaluate = $assertions.filter(assertion => 
    assertion.result.outcome.id == "earl:untested").length;
  $: totalEvaluated = $assertions.filter(assertion => 
    assertion.result.outcome.id !== "earl:untested" && assertion.subject.type.indexOf(TestSubjectTypes.WEBSITE) >= 0).length;
</script>
<Page title="{TRANSLATED.PAGE_TITLE}" pageid="define-scope">
  <p>
    {@html TRANSLATED.INTRODUCTION}
  </p>
  <ResourceLink href="https://www.w3.org/TR/WCAG-EM/#step1">{TRANSLATED.RESOURCE_LINK_NAME}</ResourceLink>

  <form id="defineScopeForm" method="" novalidate>
    <Input
      id="site_name"
      label="{TRANSLATED.SITE_NAME_LABEL}"
      helptext="{TRANSLATED.SITE_NAME_HELPTEXT}"
      bind:value="{$scopeStore['SITE_NAME']}"
    />

    <Textarea
      id="website_scope"
      label="{TRANSLATED.SITE_SCOPE_LABEL}"
      helptext="{`
        <p>${TRANSLATED.SITE_SCOPE_HELPTEXT_P1}</p>
        <ul>
          <li>${TRANSLATED.SITE_SCOPE_HELPTEXT_LI1}</li>
          <li>${TRANSLATED.SITE_SCOPE_HELPTEXT_LI2}</li>
          <li>${TRANSLATED.SITE_SCOPE_HELPTEXT_LI3}</li>
        </ul>
      `}"
      bind:value="{$scopeStore['WEBSITE_SCOPE']}"
    />

    <Select
      id="wcag_version"
      label="{TRANSLATED.WCAG_VERSION_LABEL}"
      helptext="{TRANSLATED.WCAG_VERSION_HELPTEXT}"
      options="{wcagVersions}"
      value="{$scopeStore['WCAG_VERSION']}"
      on:change={updateWCAGversion}
    />

    <Select
      id="conformance_target"
      label="{TRANSLATED.CONFORMANCE_TARGET_LABEL}"
      helptext="{TRANSLATED.CONFORMANCE_TARGET_HELPTEXT}"
      options="{conformanceLevels}"
      value="{$scopeStore['CONFORMANCE_TARGET']}"
      on:change={updateConformanceTarget}
    />

    <Textarea
      id="as_baseline"
      label="{TRANSLATED.ACCESSIBILITY_SUPPORT_BASELINE_LABEL}"
      helptext="{TRANSLATED.ACCESSIBILITY_SUPPORT_BASELINE_HELPTEXT}"
      bind:value="{$scopeStore['AS_BASELINE']}"
    />

    <Textarea
      id="additional_requirements"
      label="{TRANSLATED.ADDITIONAL_REQUIREMENTS_LABEL}"
      helptext="{`
        <p>${TRANSLATED.ADDITIONAL_REQUIREMENTS_HELPTEXT_P1}</p>
        <ul>
          <li>${TRANSLATED.ADDITIONAL_REQUIREMENTS_HELPTEXT_LI1}</li>
          <li>${TRANSLATED.ADDITIONAL_REQUIREMENTS_HELPTEXT_LI2}</li>
          <li>${TRANSLATED.ADDITIONAL_REQUIREMENTS_HELPTEXT_LI3}</li>
        </ul>
      `}"
      bind:value="{$scopeStore['ADDITIONAL_REQUIREMENTS']}"
    />
  </form>
</Page>

<script>
  import { getContext, onMount } from 'svelte';

  import { CONFORMANCE_LEVELS, WCAG_VERSIONS, scopedWcagVersions } from '@app/stores/wcagStore.js';
  import assertions from '@app/stores/earl/assertionStore/index.js';
  import { CriteriaSelected } from '@app/stores/selectedCriteriaStore.js';
  import tests from '@app/stores/earl/testStore/index.js';
  import subjects, {
    TestSubjectTypes
  } from '@app/stores/earl/subjectStore/index.js';
  import { interactedOpenEvaluation } from '@app/stores/interactedStore.js';

  import Page from '@app/components/ui/Page.svelte';
  import Input from '@app/components/form/Input.svelte';
  import Select from '@app/components/form/Select.svelte';
  import Textarea from '@app/components/form/Textarea.svelte';
  import ResourceLink from '@app/components/ui/ResourceLink.svelte';

  const { translate } = getContext('app');
  $: TRANSLATED = {
    PAGE_TITLE: $translate('PAGES.SCOPE.TITLE'),
    INTRODUCTION: $translate('PAGES.SCOPE.INTRO'),
    RESOURCE_LINK_NAME: $translate('PAGES.SCOPE.RESOURCE_LINK_NAME'),
    SITE_NAME_LABEL: $translate('PAGES.SCOPE.LABEL_SITE_NAME'),
    SITE_NAME_HELPTEXT: $translate('PAGES.SCOPE.INF_SITE_NAME'),
    SITE_SCOPE_LABEL: $translate('PAGES.SCOPE.LABEL_SITE_SCOPE'),
    SITE_SCOPE_HELPTEXT_P1: $translate('PAGES.SCOPE.INF_SITE_SCOPE_0'),
    SITE_SCOPE_HELPTEXT_LI1: $translate('PAGES.SCOPE.INF_SITE_SCOPE_LI0'),
    SITE_SCOPE_HELPTEXT_LI2: $translate('PAGES.SCOPE.INF_SITE_SCOPE_LI1'),
    SITE_SCOPE_HELPTEXT_LI3: $translate('PAGES.SCOPE.INF_SITE_SCOPE_LI2'),
    WCAG_VERSION_LABEL: $translate('PAGES.SCOPE.LABEL_WCAG_VERSION'),
    WCAG_VERSION_HELPTEXT: $translate('PAGES.SCOPE.INFO_WCAG_VERSION'),
    CONFORMANCE_TARGET_LABEL: $translate('PAGES.SCOPE.LABEL_CONFORMANCE_TGT'),
    CONFORMANCE_TARGET_HELPTEXT: $translate('PAGES.SCOPE.INF_CONF_TGT'),
    ACCESSIBILITY_SUPPORT_BASELINE_LABEL: $translate('PAGES.SCOPE.LABEL_SUPPORT_BASE'),
    ACCESSIBILITY_SUPPORT_BASELINE_HELPTEXT: $translate('PAGES.SCOPE.INF_SUPPORT_BASE'),
    ADDITIONAL_REQUIREMENTS_LABEL: $translate('PAGES.SCOPE.LABEL_EXTRA_REQUIREMENTS'),
    ADDITIONAL_REQUIREMENTS_HELPTEXT_P1: $translate('PAGES.SCOPE.INF_EXTRA_REQUIREMENTS_0'),
    ADDITIONAL_REQUIREMENTS_HELPTEXT_LI1: $translate('PAGES.SCOPE.INF_EXTRA_REQUIREMENTS_LI0'),
    ADDITIONAL_REQUIREMENTS_HELPTEXT_LI2: $translate('PAGES.SCOPE.INF_EXTRA_REQUIREMENTS_LI1'),
    ADDITIONAL_REQUIREMENTS_HELPTEXT_LI3: $translate('PAGES.SCOPE.INF_EXTRA_REQUIREMENTS_LI2'),
    CONFORMANCE_LEVEL: $translate('WCAG.COMMON.CONFORMANCE_LEVEL'),
    DATA_LOSS_WARNING: $translate('PAGES.SCOPE.DATA_LOSS_WARNING')
  };

  let wcagVersions = [...WCAG_VERSIONS].reverse().map((version) => {
    return {
      title: `WCAG ${version}`,
      value: version
    };
  });

  $: conformanceLevels = CONFORMANCE_LEVELS.map((level) => {
    return {
      title: `${TRANSLATED.CONFORMANCE_LEVEL} ${level}`,
      value: level
    };
  });

  const { scopeStore } = getContext('app');

  let oldwcag = $scopeStore['WCAG_VERSION'];
  let oldtarget = $scopeStore['CONFORMANCE_TARGET'];

  function updateWCAGversion(event){
    oldwcag = $scopeStore['WCAG_VERSION'];
    $scopeStore['WCAG_VERSION'] = event.target.value;
  }

  function updateConformanceTarget(event){
    oldtarget = $scopeStore['CONFORMANCE_TARGET'];
    $scopeStore['CONFORMANCE_TARGET'] = event.target.value;
  }

  // Used to display subject.title
  export let subject = {};

  // Used for id creation (test.id)
  export let test = {};

  let assertionsToRemove = [];
  $: {
    // Get or create an Assertion
    //$assertions = [];
    const available = [];
    $CriteriaSelected.forEach((criteria) => {
      const check = criteria.num;
      available.push(check);
      subject = $subjects.find((subject) => {
        return subject.type.indexOf(TestSubjectTypes.WEBSITE) >= 0;
    });

    test = $tests.find(($test) => {
      return $test.num === check  && $test.id === "WCAG"+$scopeStore['WCAG_VERSION'].split('.').join("")+":"+criteria.id;
    });

      
    if(test != undefined){
    $assertions.find(($assertion) => {
      const matchedTest = $assertion.test.num === test.num;
      const matchedSubject = $assertion.subject === subject;

      return matchedTest && matchedSubject;
      }) || assertions.create({ subject, test });
      }
    });

    $assertions.forEach(($assertion) => {
      var updater = $tests.find(($test) => {
        return $test.num === $assertion.test.num && $test.id.startsWith("WCAG"+$scopeStore['WCAG_VERSION'].split('.').join(""));
      });
      if(updater != undefined){
        $assertion.test = updater;
      }
    });
    
    assertionsToRemove = $assertions.filter((assertion) => {
      return available.indexOf(assertion.test.num) == -1;
    });

    if(assertionsToRemove.length > 0){
      let answeredCount = 0;
      assertionsToRemove.forEach((assertion) => {
        if(assertion.result.outcome.id != "earl:untested"){
          answeredCount++;
        }
      });

      if(answeredCount > 0){
        var allowDataLoss = true;
        if($interactedOpenEvaluation != true){
          allowDataLoss = window.confirm(TRANSLATED.DATA_LOSS_WARNING)
        }
        if (allowDataLoss) {
          assertionsToRemove.forEach((assertion) => {
            assertions.remove(assertion);
          });
        } else {
          $scopeStore['WCAG_VERSION'] = oldwcag;
          $scopeStore['CONFORMANCE_TARGET'] = oldtarget;
        }
      }else{
        assertionsToRemove.forEach((assertion) => {
          assertions.remove(assertion);
        });
      }
    }
    $interactedOpenEvaluation = false;
  }  

</script>

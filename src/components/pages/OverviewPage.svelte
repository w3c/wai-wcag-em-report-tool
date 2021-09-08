<!--
 * @component
 *   OverviewPage
 * -->
<Page title="{TRANSLATED.PAGE_TITLE}" pageid="overview">
  {#if !$previousVersionMsgDismissed}
  <div style="background: var(--footer-grey); border: 0; padding: 1em; display: flex; align-items: center" lang="en">
    <p style="max-width: none; margin: 0;">
      Welcome to the updated WCAG-EM Report Tool. You can open your existing reports with this tool. The <a href="https://w3c.github.io/wcag-em-report-tool/">previous version</a> is available, and is no longer supported. 
    </p>
    <button style="margin-left: 1em;" type="button" class="button-secondary">Dismiss</button>  </div>
  {/if}

  <div class="getting-started">
    <p class="getting-started__intro">
      {@html TRANSLATED.INTRODUCTION_P1}
    </p>

    <div class="getting-started__buttons">
      <Button on:click="{handleNewEvaluationClick}">
        {TRANSLATED.BUTTON_NEW_EVALUATION}
      </Button>
      <OpenEvaluation />
    </div>
  </div> 

  <ExpandCollapseAll />

  <details>
    <summary><h2>{TRANSLATED.TIPS_HEADING}</h2></summary>
    <ul>
      <li>{@html TRANSLATED.TIPS_1}</li>
      <li>{@html TRANSLATED.TIPS_2}</li>
      <li>{@html TRANSLATED.TIPS_3}</li>
    </ul>
  </details>

  <details>
    <summary><h2>{TRANSLATED.ABOUT_HEADING}</h2></summary>
    {@html TRANSLATED.ABOUT_1}
    {@html TRANSLATED.ABOUT_2}
  </details>

  <details>
    <summary><h2>{TRANSLATED.USAGE_HEADING}</h2></summary>
    <ul>
      <li>{TRANSLATED.USAGE_LI1}</li>
      <li>{TRANSLATED.USAGE_LI2}</li>
      <li>{TRANSLATED.USAGE_LI3}</li>
    </ul>
  </details>

</Page>
<!-- /component -->

<script>
  import { getContext } from 'svelte';
  import { useNavigate } from 'svelte-navigator';

  import Page from '@app/components/ui/Page.svelte';
  import ExpandCollapseAll from '@app/components/ui/ExpandCollapseAll.svelte';
  import OpenEvaluation from '@app/components/form/OpenEvaluation.svelte';
  import Button from '@app/components/ui/Button.svelte';

  import { routes, previousVersionMsgDismissed } from '@app/stores/appStore.js';
  import evaluationStore from '@app/stores/evaluationStore.js';
  import { interacted } from '@app/stores/interactedStore.js';

  const { translate } = getContext('app');
  const navigate = useNavigate();

  $: TRANSLATED = {
    BUTTON_NEW_EVALUATION: $translate('UI.NAV.MENU_NEW', {
      default: 'New report'
    }),
    PAGE_TITLE: $translate('PAGES.START.SUBTITLE'),
    INTRODUCTION_P1: $translate('PAGES.START.INTRO_1'),
    USAGE_HEADING: $translate('PAGES.START.USAGE_HD'),
    USAGE_LI1: $translate('PAGES.START.USAGE_LI1'),
    USAGE_LI2: $translate('PAGES.START.USAGE_LI2'),
    USAGE_LI3: $translate('PAGES.START.USAGE_LI3'),
    TIPS_HEADING: $translate('PAGES.START.TIPS_HD'),
    TIPS_1: $translate('PAGES.START.TIPS_1'),
    TIPS_2: $translate('PAGES.START.TIPS_2'),
    TIPS_3: $translate('PAGES.START.TIPS_3'),
    ABOUT_HEADING: $translate('PAGES.START.ABOUT_HEADING'),
    ABOUT_1: $translate('PAGES.START.ABOUT_1'),
    ABOUT_2: $translate('PAGES.START.ABOUT_2'),
    CHOICES_HEADING: $translate('PAGES.START.CHOICES_HEADING'),
    CHOICES_INTRO: $translate('PAGES.START.CHOICES_INTRO'),
    CHOICES_DT1: $translate('PAGES.START.CHOICES_DT1'),
    CHOICES_DD1: $translate('PAGES.START.CHOICES_DD1'),
    CHOICES_DT2: $translate('PAGES.START.CHOICES_DT2'),
    CHOICES_DD2: $translate('PAGES.START.CHOICES_DD2'),
    CHOICES_DT3: $translate('PAGES.START.CHOICES_DT3'),
    CHOICES_DD3: $translate('PAGES.START.CHOICES_DD3'),
    CHOICES_DT4: $translate('PAGES.START.CHOICES_DT4'),
    CHOICES_DD4: $translate('PAGES.START.CHOICES_DD4'),
    CHOICES_DT5: $translate('PAGES.START.CHOICES_DT5'),
    CHOICES_DD5: $translate('PAGES.START.CHOICES_DD5'),
    CLEAR_WARNING: $translate('UI.NAV.CLEARWARNING')
  };

  function handleNewEvaluationClick() {
    if ($interacted == true){
      var clearResult = window.confirm(TRANSLATED.CLEAR_WARNING);
      if (clearResult){
        $evaluationStore.reset();
        $interacted = false;
        navigate($routes.SCOPE.path, { replace: true });
      }
     } else{
      $evaluationStore.reset();
      navigate($routes.SCOPE.path, { replace: true });
    }
  }

  function dismissPreviousVersionMessage() {
    previousVersionMsgDismissed.update(() => true);
    localStorage.setItem('previousVersionMsgDismissed', 'true');
  }
</script>

<style>
  .getting-started__intro {
    font-size: 130%;
    max-width: 42em;
    margin: 0;
  }
  .getting-started__buttons {
    text-align: center;
    padding: 1em;
  }
  :global(.getting-started__buttons .Button),
  :global(.getting-started__buttons .File) {
    margin: .25em;
  }
  :global(.getting-started + .excol-all) {
    margin: 3em 0 -1em 0;
  }
  @media (min-width: 45em) {
    .getting-started {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 2em;
    }
    .getting-started__buttons {
      padding: 0;
      align-self: center;
    }
  }
</style>
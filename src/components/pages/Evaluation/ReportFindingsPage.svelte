<Page title="{TRANSLATED.PAGE_TITLE}">
  <p>
    {@html TRANSLATED.INTRODUCTION}
  </p>
  <ResourceLink href="https://www.w3.org/TR/WCAG-EM/#step5">{TRANSLATED.RESOURCE_LINK_NAME}</ResourceLink>

  <form action="" novalidate>
    <Input
      id="evaluation_title"
      label="{TRANSLATED.REPORT_TITLE_LABEL}"
      helptext="{TRANSLATED.REPORT_TITLE_HELPTEXT}"
      bind:value="{$summaryStore['EVALUATION_TITLE']}"
    />

    <Input
      id="evaluation_commissioner"
      label="{TRANSLATED.COMMISSIONER_LABEL}"
      helptext="{TRANSLATED.COMMISSIONER_HELPTEXT}"
      bind:value="{$summaryStore['EVALUATION_COMMISSIONER']}"
    />

    <Input
      id="evaluation_creator"
      label="{TRANSLATED.EVALUATOR_LABEL}"
      helptext="{TRANSLATED.EVALUATOR_HELPTEXT}"
      bind:value="{$summaryStore['EVALUATION_CREATOR']}"
    />

    <Input
      id="evaluation_date"
      label="{TRANSLATED.DATE_LABEL}"
      helptext="{TRANSLATED.DATE_HELPTEXT}"
      bind:value="{$summaryStore['EVALUATION_DATE']}"
    />

    <Textarea
      id="evaluation_summary"
      label="{TRANSLATED.EXECUTIVE_SUMMARY_LABEL}"
      helptext="{TRANSLATED.EXECUTIVE_SUMMARY_HELPTEXT}"
      bind:value="{$summaryStore['EVALUATION_SUMMARY']}"
    />

    <Textarea
      id="evaluation_specifics"
      label="{TRANSLATED.EVALUATION_SPECIFICS_LABEL}"
      helptext="{TRANSLATED.EVALUATION_SPECIFICS_HELPTEXT}"
      bind:value="{$summaryStore['EVALUATION_SPECIFICS']}"
    />
  </form>

  <details>
    <summary><h2>{TRANSLATED.AUDIT_RESULTS_HEADING}</h2></summary>
    <h3>{TRANSLATED.SUMMARY}</h3>
    <ReportSummary />
    <h3>{TRANSLATED.ALL_RESULTS}</h3>
    <ReportAllResults criteria="{$wcag}" />
  </details>
</Page>

<script>
  import { getContext } from 'svelte';
  import tests from '@app/stores/earl/testStore/index.js';

  import Page from '@app/components/ui/Page.svelte';

  import ReportAllResults from '@app/components/ui/Report/ReportAllResults.svelte';
  import ReportSummary from '@app/components/ui/Report/ReportSummary.svelte';
  import Input from '@app/components/form/Input.svelte';
  import ResourceLink from '@app/components/ui/ResourceLink.svelte';
  import Textarea from '@app/components/form/Textarea.svelte';

  import wcag from '@app/stores/wcagStore.js';

  const { summaryStore, translate, scopeStore } = getContext('app');
  $: TRANSLATED = {
    PAGE_TITLE: $translate('PAGES.SUMMARY.TITLE'),
    INTRODUCTION: $translate('PAGES.SUMMARY.INTRO'),
    RESOURCE_LINK_NAME: $translate('PAGES.SUMMARY.RESOURCE_LINK_NAME'),
    REPORT_TITLE_LABEL: $translate('PAGES.SUMMARY.LABEL_TITLE'),
    REPORT_TITLE_HELPTEXT: $translate('PAGES.SUMMARY.INF_TITLE'),
    COMMISSIONER_LABEL: $translate('PAGES.SUMMARY.LABEL_COMMISSIONER'),
    COMMISSIONER_HELPTEXT: $translate('PAGES.SUMMARY.INF_COMMISSIONER'),
    EVALUATOR_LABEL: $translate('PAGES.SUMMARY.LABEL_CREATOR'),
    EVALUATOR_HELPTEXT: $translate('PAGES.SUMMARY.INF_CREATOR'),
    DATE_LABEL: $translate('PAGES.SUMMARY.LABEL_DATE'),
    DATE_HELPTEXT: $translate('PAGES.SUMMARY.INF_DATE'),
    EXECUTIVE_SUMMARY_LABEL: $translate('PAGES.SUMMARY.LABEL_SUMMARY'),
    EXECUTIVE_SUMMARY_HELPTEXT: $translate('PAGES.SUMMARY.INF_SUMMARY'),
    EVALUATION_SPECIFICS_LABEL: $translate('PAGES.SUMMARY.LABEL_SPECIFICS'),
    EVALUATION_SPECIFICS_HELPTEXT: $translate('PAGES.SUMMARY.INF_SPECIFICS'),
    AUDIT_RESULTS_HEADING: $translate('PAGES.SUMMARY.HD_CRITERIA_REPORT'),
    SUMMARY: $translate('UI.REPORT.SUMMARY'),
    ALL_RESULTS: $translate('UI.REPORT.ALL_RESULTS')
  };
</script>

<Page
  title="{$summaryStore['EVALUATION_TITLE'] ? $summaryStore['EVALUATION_TITLE'] : TRANSLATED.PAGE_TITLE}"
  pageid="view-report"
>
  <Button on:click="{handleHTMLDownloadClick}">
    <span>{TRANSLATED.BUTTON_SAVE_HTML}</span>
  </Button>
  <Button on:click="{handleJSONDownloadClick}">
    <span>{TRANSLATED.BUTTON_SAVE_JSON}</span>
  </Button>

  <Report />
</Page>

<script>
  import { getContext } from 'svelte';

  import evaluationStore from '@app/stores/evaluationStore.js';
  import summaryStore from '@app/stores/summaryStore.js';
  import scopeStore from '@app/stores/scopeStore.js';
  import sampleStore from '@app/stores/sampleStore.js';
  import exploreStore from '@app/stores/exploreStore.js';
  import subjects, {
    initialSubjectStore,
    TestSubjectTypes
  } from '@app/stores/earl/subjectStore/index.js';
  import assertions from '@app/stores/earl/assertionStore/index.js';
  import { slugify } from '@app/scripts/slugify.js';
  import { t, locale } from 'svelte-i18n';
  import { downloadFileHTML } from '@app/scripts/files.js';

  import Button from '@app/components/ui/Button.svelte';
  import Page from '@app/components/ui/Page.svelte';
  import Report from '@app/components/ui/Report.svelte';

  const { translate } = getContext('app');

  const updateEvaluation = getContext('updateEvaluation');

  $: TRANSLATED = {
    PAGE_TITLE: $translate('PAGES.REPORT.TITLE'),
    BUTTON_SAVE_HTML: $translate('PAGES.REPORT.BTN_SAVE_HTML'),
    BUTTON_SAVE_JSON: $translate('PAGES.REPORT.BTN_SAVE_JSON')
  };

  $: htmlFilename = $scopeStore.SITE_NAME
    ? `${slugify($scopeStore.SITE_NAME)}-report.html`
    : 'report.html';

  function handleHTMLDownloadClick() {
    let reportContents = document.getElementById('view-report');

    downloadFileHTML({
      contents: reportContents,
      name: htmlFilename,
      type: 'text/html',
      lang: $locale
    });
  }

  function handleJSONDownloadClick() {
    updateEvaluation();
    $evaluationStore.save();
  }
</script>

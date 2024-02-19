<Page title="{TRANSLATED.PAGE_TITLE}" pageid="audit-sample">
  <AuditorImport />
  <p>
    {@html TRANSLATED.INTRODUCTION}
  </p>
  <ResourceLink href="https://www.w3.org/TR/WCAG-EM/#step4">
    {TRANSLATED.RESOURCE_LINK_NAME}
  </ResourceLink>
  <Auditor />
</Page>

<script>
  import { getContext } from 'svelte';

  import Auditor from '@app/components/ui/Auditor/Auditor.svelte';
  import AuditorImport from '@app/components/ui/Auditor/AuditorImport.svelte';
  import ResourceLink from '@app/components/ui/ResourceLink.svelte';
  import Page from '@app/components/ui/Page.svelte';

  const { translate } = getContext('app');

  $: TRANSLATED = {
    PAGE_TITLE: $translate('PAGES.AUDIT.TITLE'),
    INTRODUCTION: $translate('PAGES.AUDIT.INTRO'),
    RESOURCE_LINK_NAME: $translate('PAGES.AUDIT.RESOURCE_LINK_NAME')
  };
</script>

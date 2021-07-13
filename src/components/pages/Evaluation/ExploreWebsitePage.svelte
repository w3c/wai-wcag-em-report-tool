<Page title="{TRANSLATED.PAGE_TITLE}" pageid="explore-website">
  <p>
    {@html TRANSLATED.INTRODUCTION}
  </p>
  <ResourceLink href="https://www.w3.org/TR/WCAG-EM/#step2">{TRANSLATED.RESOURCE_LINK_NAME}</ResourceLink>

  <form action="" novalidate>
    <WebTechnologiesInput
      bind:value="{$exploreStore['TECHNOLOGIES_RELIED_UPON']}"
    />

    <h2>{TRANSLATED.OPTIONAL_EXPLORATION_NOTES_HEADING}</h2>
    <p>{@html TRANSLATED.OPTIONAL_EXPLORATION_NOTES_P1}</p>

    <Textarea
      id="essential_functionality"
      label="{TRANSLATED.ESSENTIAL_FUNCTIONALITY_LABEL}"
      helptext="{TRANSLATED.ESSENTIAL_FUNCTIONALITY_HELPTEXT}"
      bind:value="{$exploreStore['ESSENTIAL_FUNCTIONALITY']}"
    />

    <Textarea
      id="page_types"
      label="{TRANSLATED.VARIETY_OF_WEB_PAGE_TYPES_LABEL}"
      helptext="{TRANSLATED.VARIETY_OF_WEB_PAGE_TYPES_HELPTEXT}"
      bind:value="{$exploreStore['PAGE_TYPES']}"
    />
  </form>
</Page>

<script>
  import { getContext } from 'svelte';

  import Page from '@app/components/ui/Page.svelte';
  import ResourceLink from '@app/components/ui/ResourceLink.svelte';
  import Textarea from '@app/components/form/Textarea.svelte';
  import WebTechnologiesInput from '@app/components/form/WebTechnologiesInput.svelte';

  const { exploreStore, translate } = getContext('app');
  $: TRANSLATED = {
    PAGE_TITLE: $translate('PAGES.EXPLORE.TITLE'),
    INTRODUCTION: $translate('PAGES.EXPLORE.INTRO'),
    RESOURCE_LINK_NAME: $translate('PAGES.EXPLORE.RESOURCE_LINK_NAME'),
    OPTIONAL_EXPLORATION_NOTES_HEADING: $translate('PAGES.EXPLORE.HD_NOTE_TAKING'),
    OPTIONAL_EXPLORATION_NOTES_P1: $translate('PAGES.EXPLORE.INF_NOTE_TAKING'),
    ESSENTIAL_FUNCTIONALITY_LABEL: $translate('PAGES.EXPLORE.LABEL_ESSENT_FUNC'),
    ESSENTIAL_FUNCTIONALITY_HELPTEXT: $translate('PAGES.EXPLORE.INF_ESSENT_FUNC'),
    VARIETY_OF_WEB_PAGE_TYPES_LABEL: $translate('PAGES.EXPLORE.LABEL_VARIETY_PAGE_TYPES'),
    VARIETY_OF_WEB_PAGE_TYPES_HELPTEXT: $translate('PAGES.EXPLORE.INF_VARIETY_PAGE_TYPES')
  };
</script>

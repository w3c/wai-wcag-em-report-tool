{#if hasLocalStorageContent}
  <Button type="secondary" on:click="{handleOpenFromLocalStorageChange}">
    {TRANSLATED.BUTTON}
  </Button>
{/if}

<script>
  import { getContext } from 'svelte';
  import { useNavigate } from 'svelte-navigator';
  import Button from '@app/components/ui/Button.svelte';
  import evaluationStore from '@app/stores/evaluationStore.js';
  import DEFAULT_REPORT_NAME from '@app/stores/defaultLocalStorageName.js';
  import {
    interacted,
    interactedOpenEvaluation
  } from '@app/stores/interactedStore.js';
  const { translate } = getContext('app');

  $: TRANSLATED = {
    BUTTON: $translate('UI.NAV.MENU_OPEN_LOCAL_STORAGE', {
      default: 'Open from local storage'
    })
  };

  const navigate = useNavigate();
  let localStorageContent = localStorage.getItem(DEFAULT_REPORT_NAME);
  let hasLocalStorageContent = localStorageContent !== null;

  function handleOpenFromLocalStorageChange() {
    if (hasLocalStorageContent) {
      const serializedEvaluation = localStorageContent;
      const json = JSON.parse(serializedEvaluation);

      $evaluationStore.open(json).then(() => {
        $interactedOpenEvaluation = true;
        $interacted = true;
        navigate('/evaluation/define-scope');
      });
    }
  }
</script>

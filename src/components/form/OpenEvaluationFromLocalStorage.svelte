<Button type="secondary" on:click="{handleOpenFromLocalStorageChange}">
  {TRANSLATED.BUTTON}
</Button>

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

  function handleOpenFromLocalStorageChange() {
    if (
      localStorage.getItem(DEFAULT_REPORT_NAME) &&
      localStorage.getItem(DEFAULT_REPORT_NAME) !== null
    ) {
      const serializedEvaluation = localStorage.getItem(DEFAULT_REPORT_NAME);
      const json = JSON.parse(serializedEvaluation);

      $evaluationStore.open(json).then(() => {
        $interactedOpenEvaluation = true;
        $interacted = true;
        navigate('/evaluation/define-scope');
      });
    }
  }
</script>

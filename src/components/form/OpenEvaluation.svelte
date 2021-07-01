<File
  id="evaluation_open"
  label="{TRANSLATED.BUTTON}"
  on:change="{handleOpenChange}"
/>

<script>
  import { getContext } from 'svelte';
  import { useNavigate } from 'svelte-navigator';
  import evaluationStore from '@app/stores/evaluationStore.js';
  import { interacted } from '@app/stores/interactedStore.js';

  import File, { readFile } from './File.svelte';

  const { translate } = getContext('app');

  $: TRANSLATED = {
    BUTTON: $translate('UI.NAV.MENU_OPEN', {default: 'Open evaluation'}),
    CLEAR_WARNING: $translate('UI.NAV.CLEARWARNING'),
  };

  let loading = false;
  const navigate = useNavigate();

  function handleOpenChange(event) {
    var clearResult = true;

    console.log($interacted);
    if($interacted == true){
      var clearResult = window.confirm(TRANSLATED.CLEAR_WARNING);
    }

    if(clearResult){
      loading = true;

      const { target } = event;
      const file = target.files[0];

      readFile(file, (result) => {
        const json = JSON.parse(result);

        $evaluationStore
          .open(json)
          .then(() => {
            navigate('/evaluation/define-scope');
            $interacted = true;
          })
          .finally(() => {
            target.value = '';
            loading = false;
          });
      });
    }
  }
</script>

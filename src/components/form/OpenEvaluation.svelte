<File
  id="evaluation_open"
  label="{TRANSLATED.BUTTON}"
  on:change="{handleOpenChange}"
/>

<script>
  import { getContext } from 'svelte';
  import { useNavigate } from 'svelte-navigator';
  import evaluationStore from '@app/stores/evaluationStore.js';
  import { interacted, interactedOpenEvaluation } from '@app/stores/interactedStore.js';

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
            $interactedOpenEvaluation = true;
            navigate('/evaluation/define-scope');
            $interacted = true;
          })
          .finally(() => {
            target.value = '';
            loading = false;
          });
      });
    }else{
      event.target.value = ''
    }
  }
  
  function loadFilefromUrl() {
    
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var clearResult = true;
    if (urlParams.has("jsonUrl") && clearResult) {
      const jsonUrl = urlParams.get("jsonUrl");
      getJsonfromUrl(jsonUrl);
    }
  }

  function openJsonfromUrl(json) {
    if(json!='error') {
      json=JSON.parse(json);
      loading = true;
      $evaluationStore
        .open(json)
        .then(() => {
          $interactedOpenEvaluation = true;
          navigate('/evaluation/define-scope');
          $interacted = true;
        })
        .finally(() => {
          loading = false;
        });
    }
  }
    
  function getJsonfromUrl(url) {
    var resp;

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
    
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        
        if(this.getResponseHeader('content-type') == 'application/json; charset=utf-8') {
          var json_data = xhttp.responseText;
          openJsonfromUrl(json_data);
        }
      } else {
        openJsonfromUrl('error');
      }
    };
    xhttp.open("GET", url, false);
    xhttp.send(null);
  }

  loadFilefromUrl();
</script>

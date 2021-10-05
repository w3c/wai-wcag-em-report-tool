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
  
  function loadFromUrl() {
    
    var clearResult = true;
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);

    /*if($interacted == true){
      var clearResult = window.confirm(TRANSLATED.CLEAR_WARNING);
    }*/

    if (urlParams.has("jsonUrl") && clearResult) {
      
      loading = true;
        
        const jsonUrl = urlParams.get("jsonUrl");

        const result=getJSON(jsonUrl);
        const json = JSON.parse(result);
        
        $evaluationStore
          .open(json)
          .then(() => {
            $interactedOpenEvaluation = true;
            navigate('/evaluation/define-scope');
            $interacted = true;
          })
          .finally(() => {
            //target.value = '';
            loading = false;
          });
      }
  }
  
  function getJSON(url) {
        var resp ;
        var xmlHttp ;

        resp  = '' ;
        xmlHttp = new XMLHttpRequest();

        if(xmlHttp != null)
        {
            xmlHttp.open( "GET", url, false );
            xmlHttp.send( null );
            resp = xmlHttp.responseText;
        }

        return resp ;
    }

  loadFromUrl();
</script>

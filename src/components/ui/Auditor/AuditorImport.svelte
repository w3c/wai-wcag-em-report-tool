<div class="AuditorImport">
  <span class="AuditorImport__beta">Beta</span>
  <p>{@html TRANSLATED.IMPORT_DATA_INTRO}
    <a href="https://github.com/w3c/wai-wcag-em-report-tool/wiki/How-to-use-the-%E2%80%9CAdd-data-from-other-(automated)-tests%E2%80%9D-functionality" class="more-info" title={TRANSLATED.MORE_INFO}>
      <span aria-hidden="true" class="more-info__icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 450">
<path fill="currentColor" d="M256 344v-40c0-4.5-3.5-8-8-8h-24v-128c0-4.5-3.5-8-8-8h-80c-4.5 0-8 3.5-8 8v40c0 4.5 3.5 8 8 8h24v80h-24c-4.5 0-8 3.5-8 8v40c0 4.5 3.5 8 8 8h112c4.5 0 8-3.5 8-8zM224 120v-40c0-4.5-3.5-8-8-8h-48c-4.5 0-8 3.5-8 8v40c0 4.5 3.5 8 8 8h48c4.5 0 8-3.5 8-8zM384 224c0 106-86 192-192 192s-192-86-192-192 86-192 192-192 192 86 192 192z"></path>
        </svg>
     </span>
     <span class="visuallyhidden">{TRANSLATED.MORE_INFO}</span>
    </a>
  </p>
  <File
    id="import__assertions"
    label="{TRANSLATED.BUTTON}"
    labelsub="({TRANSLATED.BUTTON_HINT})"
    on:change="{handleChange}"
    on:click={handleClick}
  />
</div>

<style>
  a.more-info,
  a.more-info:visited {
    color: var(--light-blue);
    margin-left: .25em;
    font-size: .8rem;
  }
  a.more-info:hover {
    color: var(--ocean);
  }
  .more-info__icon {
    display: inline-block;
    vertical-align: middle;
  }
  .more-info__icon svg {
    height: 1.5em;
  }
  .AuditorImport {
    margin: 1em 0 1em;
    border: 1px solid var(--line-grey);
    padding: 1em;
    font-size: 90%;
    position: relative;
  }
    .AuditorImport p:first-child {
      margin-top: 0;
    }
    .AuditorImport__beta {
      background-color: var(--cloudy);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: .25em .5em;
      position: absolute;
      top: -1em;
      left: 1em;
      transform: rotate(-1deg);
      font-size: 90%;
      display: inline-block;
    }
  @media (min-width: 47.5em) {
    .AuditorImport {
      float: right;
      margin: 0 0 1em 2em;
      padding: 1em;
      text-align: center;
      max-width: 10em;
    }
  }
</style>

<script>
  import { getContext } from 'svelte';

  import { IMPORT_ERROR, JSONLD_ERROR } from '@app/data/errors.json';
  import { importAssertions } from '@app/stores/earl/assertionStore/index.js';
  import File, { readFile } from '@app/components/form/File.svelte';

  const { translate } = getContext('app');

  $: TRANSLATED = {
    BUTTON: $translate('UI.NAV.MENU_IMPORT', { default: 'Import data' }),
    BUTTON_HINT: $translate('UI.NAV.MENU_IMPORT_HINT'),
    IMPORT_DATA_INTRO: $translate('PAGES.AUDIT.IMPORT_DATA_INTRO'),
    JSONLD_SYNTAX: $translate('UI.IMPORT.ERROR.JSONLD_SYNTAX'),
    NO_ASSERTIONS: $translate('UI.IMPORT.ERROR.NO_ASSERTIONS'),
    NO_COMPATIBLE_ASSERTIONS: $translate('UI.IMPORT.ERROR.NO_COMPATIBLE_ASSERTIONS'),
    ERROR_DEFAULT: $translate('UI.COMMON.ERROR.DEFAULT'),
    IMPORT_SUCCESSFUL: $translate('UI.IMPORT.SUCCESSFUL'),
    FILE_ERROR: $translate('UI.IMPORT.ERROR.FILE_ERROR'),
    MORE_INFO: $translate('UI.IMPORT.MORE_INFO')
  };

  function handleClick (event) {
    event.target.value = ''
  }

  function handleChange(event) {
    const { target } = event;
    const file = event.target.files[0];

    readFile(file, (result) => {
      let json;

      try {
        console.log(TRANSLATED.FILE_ERROR);
        json = JSON.parse(result);
      } catch (error) {
        console.error(error.message);
        let errorMessage = TRANSLATED.FILE_ERROR;
        alert(`Import failed:\n${errorMessage}`);
        return;
      }

      importAssertions(json)
        .then((imported) => {
          const criteria = Object.keys(imported)
            .map((num) => `– ${num}`)
            .join('\n');

          alert(`Import successful:\n${TRANSLATED.IMPORT_SUCCESSFUL}.`);
        })
        .catch((error) => {
          console.error(error);
          let errorMessage;

          switch (error.message) {
            case JSONLD_ERROR.SYNTAX:
              errorMessage = 'TRANSLATED.JSONLD_SYNTAX';
              break;

            case IMPORT_ERROR.NO_ASSERTIONS:
              errorMessage = 'TRANSLATED.NO_ASSERTIONS';
              break;

            case IMPORT_ERROR.NO_COMPATIBLE_ASSERTIONS:
              errorMessage = TRANSLATED.NO_COMPATIBLE_ASSERTIONS;
              break;

            default:
              errorMessage = TRANSLATED.ERROR_DEFAULT;
          }

          alert(`Import failed:\n${errorMessage}`);
        })
        .finally(() => {
          target.value = '';
        });
    });
  }
</script>

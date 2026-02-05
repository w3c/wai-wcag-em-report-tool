<fieldset id="{id}" class="Fieldset field">
  <legend>
    {@html legend}
    {#if helptext}
      <button 
        type="button" 
        on:click={toggle} 
        class="button button-small showhidebutton" 
        aria-expanded={showHelptext} 
        aria-controls={`field-helptext-${id}`}
        aria-label={`${TRANSLATED.SHOW_HIDE_HELPTEXT} ${TRANSLATED.FOR} ${legend}`}>
          {TRANSLATED.SHOW_HIDE_HELPTEXT}
      </button>
      {#if showHelptext}
        <div class="Fieldset__helptext" id={`field-helptext-${id}`}>
        {@html helptext}
        </div>
      {/if}
    {/if}
  </legend>

  <div class="Fieldset__elements">
    <slot />
  </div>
</fieldset>

<style>
  .Fieldset {
    padding: 0;
  }
  .Fieldset legend /* override from original WAI style to make it work better in this application  */ {
    width: 100%; /* Ensures legend spans full width so fieldset background color appears continuous */
    font-size: 1rem;
  }

  /* Fixes .field:focus-within (external style) background styling and prevents flickering */
  :global(.field:has(label:active)),
  :global(.field:has(label:active)) legend,
  :global(.field:focus-within) legend {
    background-color: #edf4fa;
  }

  /* Prevents outline flickering when clicking labels */
  :global(.field:has(label:active)) {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .Fieldset__helptext {
    font-size: 1rem; /* reset legend size */
    font-weight: normal; /* reset legend weight */
    margin: 1em 0;
    border: solid 1px #069;
    padding: 1em;
    background-color: #d0e1f1;
  }

  :global(.Fieldset__elements > *:not(:last-child)) {
    margin-bottom: 2rem;
  }
</style>

<script>
  import { getContext } from 'svelte';

  export let id;
  export let legend;
  export let helptext = "";

  function toggle() {
    showHelptext = !showHelptext;
  }

  let showHelptext = false;

  const { translate } = getContext('app');
  $: TRANSLATED = {
    SHOW_HIDE_HELPTEXT: showHelptext
      ? $translate('UI.COMMON.BUTTON.HIDE', {
          values: { subject: $translate('UI.COMMON.BUTTON.INFO') }
        })
      : $translate('UI.COMMON.BUTTON.SHOW', {
          values: { subject: $translate('UI.COMMON.BUTTON.INFO') }
        }),
    FOR: $translate('UI.COMMON.FOR')
  };
</script>

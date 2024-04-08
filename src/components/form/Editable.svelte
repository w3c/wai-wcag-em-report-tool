<div class="Editable">
  <div class="Editable__Contents">
    {#if removable}
    <button
      type="button"
      class="Editable__Control--delete"
      on:click="{dispatchDelete}"
    >
      <svg 
        focusable="false"
        aria-hidden="true"
        role="presentation"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17" stroke="#ffffff"/>
          <line x1="14" y1="11" x2="14" y2="17" stroke="#ffffff" />
      </svg>
      <span class="visually-hidden">{TRANSLATED.DELETE} {label}</span>
    </button>
    {/if}    
    <slot />
  </div>

  <div class="Editable__Controls">
    {#if !persistent}
      <button
        type="button"
        class="Editable__Control--edit button-secondary"
        on:click="{handleEditClick}"
        bind:this="{EditToggle}"
      >{#if editing}Done{:else}Edit{/if}
        <span class="visually-hidden">{label}</span></button>
    {/if}
  </div>
</div>

<style>
  .Editable__Control--delete {
    font-size: 1em;
    float: right;
    margin-left: 1em;
    margin-top: .25em;
    padding: 0;
    border: 0;
    background-color: transparent;
    color: currentColor;
    width: 1em;
		display: inline-block;
  }
  .Editable {
    background: var(--trans-line-grey);
    padding: 1em;   
  }
  :global(.Editable .Editable__Contents .sample-input .Field) {
    margin-bottom: .5em;
  }
  :global(.Editable legend) {
    font-size: 1em;
    padding: 0; 
    margin-bottom: .25em;
  }
  :global(.Editable fieldset) {
    margin-bottom: 0;
  }
</style>

<script context="module">
  import { writable } from 'svelte/store';

  export const editMode = writable({});
</script>

<script>
  import { getContext, createEventDispatcher } from 'svelte';

  export let id = '';
  export let label = '';
  export let persistent = false;
  export let removable = false;
  
  const { translate } = getContext('app');

  const dispatch = createEventDispatcher();
  const EVENT = {
    DELETE: 'DELETE',
    EDIT: 'EDIT'
  };

  let EditToggle;

  $: editing = $editMode[id] = persistent;

  $: TRANSLATED = {
    DELETE: $translate('UI.COMMON.DELETE')
  };

  function handleEditClick() {
    if (!editing) {
      dispatchEdit();
    }

    $editMode[id] = !editing;
  }

  function dispatchDelete() {
    dispatch(EVENT.DELETE, id);
  }

  function dispatchEdit() {
    dispatch(EVENT.EDIT, id);
  }
</script>

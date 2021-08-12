<Field {id} {label} {helptext} {className}>
  <textarea id="{id}" rows={contentBasedRows} bind:value on:change></textarea>
  <slot name="after-textarea"></slot>
</Field>

<style>
  textarea {
    display: block;
    width: 100%;
    max-width: 40em;
  }
  :global(.criterion textarea) {
    max-width: none;
  }
</style>

<script>
  import Field from './Field.svelte';

  const defaultRows = 5;
  let contentBasedRows;

  $: contentBasedRows = value && value.match(/\n/g) ? 
    value.match(/\n/g).length + defaultRows 
    : defaultRows;
  
  export let id;
  export let label;
  export let helptext = "";
  export let value = "";
  export let className = "";
</script>

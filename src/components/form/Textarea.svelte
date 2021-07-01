<Field {id} {label} {helptext} {className}>
  <textarea id="{id}" rows="5" bind:value on:change></textarea>
  <slot name="after-textarea"></slot>
</Field>

<style>
  textarea {
    display: block;
    width: 100%;
  }
</style>

<script>
  import Field from './Field.svelte';

  export let id;
  export let label;
  export let helptext = "";
  export let value = "";
  export let className = "";
</script>

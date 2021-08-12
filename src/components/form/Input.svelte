<Field id="{id}" {...$$restProps}>
  <input
    id="{id}"
    type="text"
    on:keydown
    bind:value
    bind:this="{textInput}"
  />
</Field>

<script>
  import { onMount } from 'svelte';
  import Field from './Field.svelte';

  export let id;
  export let value = '';
  export let autofocus = false;

  let textInput;

  onMount(() => {
    if (autofocus) {
      textInput.focus();
    }
  });
</script>

<style>
  input {
    max-width: 40em;;
  }
</style>
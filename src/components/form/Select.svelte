<!--
 * @component
 * Select
 * @property id <String:Unique>
 * @property label <String>
 * @property options <Array:Option{
 *   title <String>
 *   value <String>
 *   selected <Boolean>
 * }>
 * -->
<Field id="{id}" {...$$restProps}>
  <select id="{id}" disabled="{options.length === 0}" bind:value on:blur>
    {#each options as option}
      <option
        value="{option.value || option.title || option}"
        selected="{option.selected}"
      >
        {option.title || option}
      </option>
    {:else}
      <option value="null">No options</option>
    {/each}
  </select>
</Field>
<!-- /component -->

<script>
  import Field from './Field.svelte';

  export let id;
  export let options = [];
  export let value;
</script>

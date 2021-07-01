<div class={`${className} Field`}>
  <slot />
  {#if helptext}
    <HelpText
      labelHTML="{label && `<label for="${id}">${label}</label>`}"
      {label}
    >
      {@html helptext}
    </HelpText>
  {:else if label}<label for="{id}">{label}:</label>{/if}
</div>

<style>
  .Field {
    padding: 0;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .Field label {
    display: block;
  }
  .Field label,
  :global(.Field .HelpText) {
    order: -1;
  }
  :global(.Field input) {
    width: 100%;
  }
  :global(.Field > *:not(:last-child)) {
    margin-bottom: 0.25em;
  }
</style>

<script>
  import HelpText from './HelpText.svelte';

  export let id;
  export let label;
  export let helptext = "";
  export let className = "";
</script>

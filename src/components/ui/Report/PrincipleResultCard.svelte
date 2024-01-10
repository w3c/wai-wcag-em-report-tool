<li class="principle-result-card">
  <span class="principle-result-card__number">{items.length}</span>
  <span class="principle-result-card__label">{label}</span>
  {#if !!totalItems}
    <span
      class="principle-result-card__percentage"
    >{`(${Math.round((items.length / totalItems) * 100)}% rate)`}</span>
  {/if}
</li>

<style>
  .principle-result-card {
    list-style: none;
    display: inline-block;
    margin: 1em;
    text-align: center;
  }
  .principle-result-card__number {
    font-size: 1.5em;
    display: block;
    margin-bottom: 0.125em;
    line-height: 1;
    color: var(--ocean);
  }
  .principle-result-card__label {
    display: block;
    font-size: 1.125em;
  }
  .principle-result-card__percentage {
    font-size: 0.875em;
    display: block;
  }
</style>

<script>
  export let label;
  export let items = [];
  export let totalItems = null;
</script>

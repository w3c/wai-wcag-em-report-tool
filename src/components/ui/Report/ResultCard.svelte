<li class="result-card">
  <span class="result-card__number">{items.length}</span>
  <span class="result-card__label">{label}</span>
</li>

<style>
  .result-card {
    list-style: none;
    display: inline-block;
    margin: 1em;
    text-align: center;
  }
  .result-card__number {
    font-size: 1.5em;
    display: block;
    margin-bottom: 0.125em;
    line-height: 1;
    color: var(--ocean);
  }
  .result-card__label {
    display: block;
    font-size: 1.125em;
  }
</style>

<script>
  export let label;
  export let items = [];
</script>

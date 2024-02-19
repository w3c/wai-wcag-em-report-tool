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
  @media (min-width: 60em) {
    .result-card__number {
      font-size: 3em;
    }
  }
  .result-card__label {
    font-size: 1.125em;
  }
</style>

<script>
  export let label;
  export let items = [];
</script>

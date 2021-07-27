<Fieldset id="{id}" legend={label} {...$$restProps}>

  <ol class="MultipleChoice__options{columns ? '--columns' : ''}">
    {#each options as option, index (option)}
      <li class="MultipleChoice__option">
        <!-- type attribute cant be dynamic with bind:group -->
        {#if type === CHECKBOX}
          <!-- svelte-ignore a11y-no-onchange -->
          <input
            id="{`${id}_${index}`}"
            class="MultipleChoice__option__input"
            type="checkbox"
            value="{option.value || option.title || option}"
            checked="{option.checked}"
            name="{label}"
            bind:group="{value}"
            on:change
          />
        {:else if type === RADIO}
          <input
            id="{`${id}_${index}`}"
            class="MultipleChoice__option__input"
            type="radio"
            value="{option.value || option.title || option}"
            checked="{option.checked}"
            name="{label}"
            bind:group="{value}"
            on:change
          />
        {/if}
        <label class="MultipleChoice__option__label" for="{`${id}_${index}`}">{option.title || option}</label>
      </li>
    {/each}
  </ol>

  {#if editable}
    <AddOther label="Add other {label}" on:ADD="{handleOptionAdd}">
      <Input id="{id}__other" label="Other {label}" />
    </AddOther>
  {/if}
</Fieldset>

<style>
  .MultipleChoice__option__label,
  .MultipleChoice__option__input {
    display: inline-block;
    cursor: pointer;
  }

  .MultipleChoice__option__input {
    flex-grow: 0;
    flex-shrink: 0;
    width: 1em;
    height: 1em;
  }

  .MultipleChoice__option__label {
    margin-left: 0.5em;
    flex-grow: 0;
    flex-shrink: 1;
    word-break: break-word;
  }

  .MultipleChoice__option__input:focus,
  .MultipleChoice__option__input:hover {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .MultipleChoice__options,
  .MultipleChoice__options--columns {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .MultipleChoice__options--columns {
    columns: 4 10em;
    column-gap: 2em;
  }

  .MultipleChoice__option {
    break-inside: avoid-column;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
</style>

<script context="module">
  const CHECKBOX = 'checkbox';
  const RADIO = 'radio';
</script>

<script>
  import AddOther from './AddOther.svelte';
  import Fieldset from './Fieldset.svelte';
  import Input from './Input.svelte';

  export let id;
  export let label;
  export let type = CHECKBOX;
  export let options = [];
  export let columns = false;
  export let editable = false;
  export let value = [];

  function handleOptionAdd(event) {

    const newValue = event.detail.join();

    if (!newValue) {
      return;
    }

    const newOption = {
      title: event.detail.join()
      // checked: true
    };

    if (!options.some((option) => option.title === newOption.title)) {
      options = [...options, newOption];
      value = [...value, newOption.title];
    }
  }
</script>

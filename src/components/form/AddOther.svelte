<!--
 * @component
 * ListInput
 * A customizable forminput that receives
 * a value as array with either a string or an object.
 * a format of how to add a list item which is
 * an array of objects containing:
 * - required label
 * - required type; text | textarea | select | checkbox(group)
 * - optional helptext
 * - optional ...any; required props to pass on to specific formcomponents
 *
 * -->

<div class="AddOther__container">
  <div
    class="AddOther__Inputs"
    bind:this="{otherInputsContainer}"
    on:keydown="{handleAddKeydown}"
  >
    <slot />
  </div>
  <Button type="secondary" on:click="{handleAddClick}">{label}</Button>
</div>

<style>
  :global(.AddOther__Inputs > *:not(:last-child)) {
    margin: 0 0 1em;
  }
  :global(.AddOther__Inputs > *:last-child) {
    margin-bottom: 0;
  }
</style>

<script>
  import { onMount, createEventDispatcher } from 'svelte';

  import Button from '@app/components/ui/Button.svelte';

  export let label = 'Add';

  const dispatch = createEventDispatcher();

  let otherInputsContainer;
  let otherInputs;

  onMount(() => {
    otherInputs = Array.from(
      otherInputsContainer.querySelectorAll('input, select, textarea')
    );
  });

  function handleAddKeydown(event) {
    if (event.key.toLowerCase() === 'enter') {
      event.preventDefault();

      dispatchAdd();
    }
  }

  function handleAddClick(event) {
    event.preventDefault();
    dispatchAdd();
  }

  function dispatchAdd() {
    const detail = otherInputs.map((input) => {
      return input.value;
    });

    if (otherInputs.length > 0) {
      // Clear fields
      otherInputs.forEach((input) => {
        input.value = '';
      });

      otherInputs[0].focus();
    }

    dispatch('ADD', detail);
  }
</script>

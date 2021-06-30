<Editable
  id="{data.ID}"
  label="{data.title || $translate('PAGES.SAMPLE.SAMPLE_PAGE')}"
  persistent="{true}"
  removable="{true}"
  on:DELETE
>
  <fieldset>
    <legend>{$translate('PAGES.SAMPLE.SAMPLE_PAGE')} {data.title || count}</legend>
    <div class="sample-input">
      <Input
        id="{id}--title"
        label="{$translate('PAGES.SAMPLE.LABEL_HANDLE')}"
        autofocus="{true}"
        bind:value="{data.title}"
      />
      <Input
        id="{id}--description"
        label="{$translate('PAGES.SAMPLE.LABEL_PAGE')}"
        bind:value="{data.description}"
      />
    </div>
  </fieldset>
</Editable>

<style>

@media (min-width: 40em) {
  .sample-input {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1em;
  }
}
</style>

<script>
  import { getContext } from 'svelte';

  import Editable from '@app/components/form/Editable.svelte';
  import Input from '@app/components/form/Input.svelte';

  export let id;
  export let data;
  export let count;

  const { translate } = getContext('app');
</script>

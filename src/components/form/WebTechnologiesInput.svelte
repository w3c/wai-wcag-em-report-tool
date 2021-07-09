<MultipleChoice
  id="technologies_relied_upon"
  label="{TECHNOLOGIES_LABEL}"
  helptext="{TECHNOLOGIES_HELPTEXT}"
  bind:options="{$webTechnologyStore}"
  bind:value
/>

<div class="add-tech">
  <legend>{BTN_ADD_TECH}</legend>
  <AddOther
    label="{ADD_TECH}"
    on:ADD="{handleTechnologyAdd}">
    <div class="tech-input">
      <Input
        id="technologies_relied_upon__other--name"
        label="{TECHNOLOGY_NAME_LABEL}"
      />
      <Input
        id="technologies_relied_upon__other--url"
        label="{TECHNOLOGY_URL_LABEL}"
      />
    </div>
  </AddOther>
</div>

<style>
  .add-tech {
    background: var(--trans-line-grey);
    padding: 1em;   
  }

  .add-tech legend {
    font-size: 1em;
    padding: 0;
    margin-bottom: .25em;
  }

  @media (min-width: 40em) {
    .tech-input {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 1em;
    }
  }
</style>

<script>
  import { getContext, onMount } from 'svelte';

  import { webTechnologyStore } from '@app/stores/exploreStore.js';
  import exploreStore from '@app/stores/exploreStore.js';

  import AddOther from './AddOther.svelte';
  import Input from './Input.svelte';
  import MultipleChoice from './MultipleChoice.svelte';

  export let value = [];

  const { translate } = getContext('app');
  $: TECHNOLOGIES_LABEL = $translate('PAGES.EXPLORE.HD_RELIEDUP_TECH');
  $: TECHNOLOGIES_HELPTEXT = $translate('PAGES.EXPLORE.INF_RELIEDUP_TECH');
  $: TECHNOLOGY_HELPTEXT = $translate('PAGES.EXPLORE.PLH_TECH');
  $: TECHNOLOGY_NAME_LABEL = $translate('PAGES.EXPLORE.LABEL_TECH');
  $: TECHNOLOGY_URL_LABEL = $translate('PAGES.EXPLORE.LABEL_TECH_SPEC');
  $: BTN_ADD_TECH = $translate('PAGES.EXPLORE.BTN_ADD_TECH');
  $: ADD_TECH = $translate('PAGES.EXPLORE.ADD_TECH');

  function handleTechnologyAdd(event) {
    const { detail } = event;
    const [title, description] = detail;
    const currentTechnologies = $webTechnologyStore;
    const withValue = detail.reduce((hasValue, value) => {
      if (hasValue) {
        return true;
      }

      return value.trim().length > 0;
    }, false);

    function exists(tech) {
      return currentTechnologies.some((currentTech) => {
        return (
          currentTech === tech ||
          currentTech.title === tech.title ||
          currentTech.description === tech.description
        );
      });
    }

    if (!withValue) {
      return;
    }

    if (withValue && !exists({ title, detail })) {
      webTechnologyStore.create({
        title,
        description
      });

      value = [...value, title];
    }
  }

  function updateTech() {
    $exploreStore["TECHNOLOGIES_RELIED_UPON"].forEach((tech) => {
      const currentTechnologies = $webTechnologyStore;
      let exists = currentTechnologies.filter((currentTech) => {
        return currentTech.title == tech;
      });

      if(exists.length == 0){
        let title = tech;
        let description = "";
        webTechnologyStore.create({
          title,
          description
        });
      }
    });
  }

  onMount(() => {
    updateTech();
  });

</script>

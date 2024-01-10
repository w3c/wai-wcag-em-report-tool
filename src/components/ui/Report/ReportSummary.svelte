<ReportNumbers criteria="{criteriaCount}" />

<script>
  import ReportNumbers from './ReportNumbers.svelte';

  import { CriteriaSelected } from '@app/stores/selectedCriteriaStore.js';
  let criteriaCount = 0;
  $: criteriaCount = $CriteriaSelected.length;
</script>

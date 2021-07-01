<!--
 * @component
 *   AuditorFilter
 *
 * @note
 *   Might be good to setup for dynamic additions
 *   e.g. pass filters and cycle with each
 *   also dispatching a FILTER event back up with details
 * -->
<div class="Auditor__Filter">
  <MultipleChoice
    id="filter_wcag_version"
    label={TRANSLATED['LABEL_VERSION']}
    type="radio"
    options="{versionFilterOptions}"
    bind:value="{$auditFilter['VERSION']}"
  />

  <MultipleChoice
    id="filter_conformance_level"
    label={TRANSLATED['LABEL_LEVEL']}
    options="{conformanceLevels}"
    helptext={false}
    bind:value="{$auditFilter['LEVEL']}"
  />

  <AuditorSamples />
</div>
<!-- /component -->

<style>
  .Auditor__Filter {
    grid-column: 1 / 2;
  }
</style>

<script>
  import { getContext } from 'svelte';

  import { auditFilter } from '@app/stores/auditStore.js';
  import { CONFORMANCE_LEVELS, scopedWcagVersions } from '@app/stores/wcagStore.js';

  import AuditorSamples from './AuditorSamples.svelte';
  import MultipleChoice from '@app/components/form/MultipleChoice.svelte';

  const { translate } = getContext('app');
  const { scopeStore } = getContext('app');

  const wcagVersions = [...$scopedWcagVersions].reverse();

  $: versionFilterOptions = wcagVersions.reduce((result, version, index) => {
    const newFilter = {
      title: `WCAG ${version}`,
      value: wcagVersions.filter((VERSION) => {
        return VERSION <= version;
      }).join()
    };
    result.push(newFilter);

    if (index === $scopedWcagVersions.length - 1) {
      return result;
    }

    // Add a version added filter
    // Last index excluded, it is the first version.
    result.push({
      title: TRANSLATED['ADDED_IN'] + " WCAG "  + version,
      value: version
    });

    return result;
  }, []);

  $: TRANSLATED = {
    LABEL_VERSION: $translate('PAGES.AUDIT.LABEL_VERSION'),
    LABEL_LEVEL: $translate('PAGES.AUDIT.LABEL_LEVEL'),
    ADDED_IN: $translate('PAGES.AUDIT.ADDED_IN')
  }

  $: conformanceLevels = CONFORMANCE_LEVELS.reduce((result, level, index) => {
    if($scopeStore['CONFORMANCE_TARGET'].startsWith(level)){
      const newFilter = {
        title: `${$translate('WCAG.COMMON.CONFORMANCE_LEVEL')} ${level}`,
        value: level
    };
    result.push(newFilter);
    }
    
    return result;
  }, []);

</script>

<!--
 * @component
 *   NavigationBar
 *  -->
<nav class="Nav default-grid">
  <ol class="Nav__Itemcontainer">
    {#each navigationItems as navigationItem}
      <li
        class="nav__item"
        class:current="{navigationItem.path === currentPath}"
      >
        <Link to="{navigationItem.path}">{navigationItem.title}</Link>
      </li>
    {/each}
  </ol>
</nav>
<!-- /component -->

<style>
  .Nav {
    background-color: #d0e1f1;
    background-color: var(--cloudy-subtle);
  }

  .Nav__Itemcontainer {
    grid-column: 2 / 10;
    display: flex;
    flex-direction: row;
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow-x: auto;
  }

  .nav__item.current {
    background-color: #fff;
  }

  @media (min-width: 40.1em) {
    .Nav__Itemcontainer {
      flex-direction: row;
    }
  }
</style>

<script>
  import { getContext } from 'svelte';
  import { Link, useLocation } from 'svelte-navigator';

  const { translate } = getContext('app');

  $: navigationItems = [
    {
      path: '/auditor',
      title: $translate('UI.NAV.WZRD_START')
    },
    {
      path: '/evaluation/define-scope',
      title: $translate('UI.NAV.WZRD_SCOPE')
    },
    {
      path: '/evaluation/explore-website',
      title: $translate('UI.NAV.WZRD_EXPLORE')
    },
    {
      path: '/evaluation/select-sample',
      title: $translate('UI.NAV.WZRD_SAMPLE')
    },
    {
      path: '/evaluation/audit-sample',
      title: $translate('UI.NAV.WZRD_AUDIT')
    },
    {
      path: '/evaluation/report-findings',
      title: $translate('UI.NAV.WZRD_REPORT')
    },
    {
      path: '/evaluation/view-report',
      title: $translate('UI.NAV.WZRD_VIEWREPORT')
    }
  ];

  const location = useLocation();

  $: currentPath = $location.pathname;
</script>

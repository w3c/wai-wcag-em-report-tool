<!--
 * @component
 *   Pager
 *
 * -->
<div class="default-grid">
  <aside class="Pager pager" aria-label={TRANSLATED.PREVIOUSNEXT}>
    <ul>
      {#if previousPage}
        <li class="Pager__Item pager--item previous">
          <Link to="{previousPage.path}">
            <svg aria-hidden="true" class="pager--item-icon icon-arrow-left">
              <use
                xlink:href={`${$basepath}/images/icons.svg#icon-arrow-left`}
              ></use>
            </svg>
            <span class="pager--item-text">
              <span
                class="pager--item-text-direction"
              >{TRANSLATED.PREVIOUS}</span>
              <span class="pager--item-text-target">{previousPage.title}</span>
            </span>
          </Link>
        </li>
      {/if}

      {#if nextPage}
        <li class="Pager__Item pager--item next">
          <Link to="{nextPage.path}">
            <svg aria-hidden="true" class="pager--item-icon icon-arrow-right">
              <use
                xlink:href=
                {`${$basepath}/images/icons.svg#icon-arrow-right`}
              ></use></svg>
            <span class="pager--item-text">
              <span class="pager--item-text-direction">{TRANSLATED.NEXT}</span>
              <span class="pager--item-text-target">{nextPage.title}</span>
            </span>
          </Link>
        </li>
      {/if}
    </ul>
  </aside>
</div>
<!-- /component -->

<style>
  .Pager {
    grid-column: 2 / 10;
  }
</style>

<script>
  import { getContext } from 'svelte';
  import { Link, useLocation } from 'svelte-navigator';
  import { basepath } from '@app/stores/appStore.js';

  export let label = 'page';
  export let context = [];

  const { translate } = getContext('app');

  $: TRANSLATED = {
    PREVIOUSNEXT: $translate('UI.COMMON.PREVIOUSNEXT'),
    NEXT: $translate('UI.COMMON.NEXT', {
      default: 'Next {label}',
      values: { label }
    }),
    PREVIOUS: $translate('UI.COMMON.PREVIOUS', {
      default: 'Previous {label}',
      values: { label }
    })
  };

  $: indexedContext = context.map((page, index) => {
    return {
      path: page.path || '/',
      title: page.title || '',
      index
    };
  });

  $: pageCount = indexedContext.length;
  let location = useLocation();

  $: currentPage = indexedContext.find(
    (page) => page.path === $location.pathname
  );
  $: currentPageIndex = currentPage ? currentPage.index : null;

  $: previousPage =
    currentPageIndex > 0 && indexedContext[currentPageIndex - 1];
  $: nextPage =
    currentPageIndex < pageCount - 1 && indexedContext[currentPageIndex + 1];
</script>

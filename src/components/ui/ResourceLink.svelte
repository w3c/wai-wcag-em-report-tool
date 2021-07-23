<a
  href="{href}"
  class="link-to-guidance button button-small button-secondary"
  target="_blank"
  rel="noopener roreferrer"
>
  <svg aria-hidden="true" class="icon-info"><use
      xlink:href={`${$basepath}/images/icons.svg#icon-info`}
    ></use></svg>
  <span>
    <slot />
  </span>
</a>

<style>
  .link-to-guidance {
    border-width: 1px;
    font-weight: normal;
    color: var(--dk-grey);
    border-color: var(--line-grey);
    vertical-align: middle;
    margin: 2px 0;
  }
  .link-to-guidance:hover,
  .link-to-guidance:focus {
    color: var(--off-black);
    background-color: var(--off-white);
  }
  .link-to-guidance svg {
    margin-right: 0.25em;
  }
  :global(.link-to-guidance + form) {
    margin-top: 2em;
  }
</style>

<script>
  import { basepath } from '@app/stores/appStore.js';

  export let href;
</script>

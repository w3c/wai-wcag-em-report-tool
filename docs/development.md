# Development

## Best practices

### Svelte

See `.prettierrc.js` for prettier configuration for Svelte (3).

#### Components

- Component structure:

  As opposed to default component markup created by most Svelte itself, reverse the declaration; markup, style and last script. This to make it more readable, structure first, details later.
  If you need to export functionality from the component to be used in other contexts, without component rendering, use the module context script.

  1. Component Markup
  2. Style block
  3. Script block
  4. Script context="module"

- Component naming

  Inside the components folder you will find:

  - layouts; `{Component}Layout.svelte`
  - pages; `{Component}Page.svelte`
  - forms; `{Component}Form.svelte`

- Component events

  - Custom events fired by createEventDispatcher should be uppercase; `CUSTOM_EVENT` with the exception of firing normal events.

  ```html
  <!-- Normal event -->
  <Tag on:click />

  <!-- With custom event -->
  <Tag on:CUSTOM_EVENT />

  <!-- Dispatching a normal as custom event should use the default lowercasing -->
  <script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    // dispatching a normal event
    dispatch('click', {/* details */});
  </script>
  ```

- Component styling

  - Do not set top-level margins, only set child component margins;

    > Component context should decide spacing between children


### JavaScript

- Variable naming:

  - `Class` or `HTMLElement` or `Component`
  - `property` or `longPropertyNames`
  - `CONSTANT` or `LONG_CONSTANT`


## JSON-LD

- Context absolute IRI's should start with http protocol; This to ensure compatibility with other tools and prevent mismatches.

  > This tool will force context IRI's to http before matching contents.

- When using URI's default to https protocol

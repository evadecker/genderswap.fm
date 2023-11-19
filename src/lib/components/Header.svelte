<script lang="ts">
  import Logo from './Logo.svelte';
  import AddIcon from '~icons/ri/add-line';
  import { fade } from 'svelte/transition';
  import Tag from '$lib/components/Tag.svelte';
  import { createTooltip, melt } from '@melt-ui/svelte';
  import { TAGS } from '$lib/constants.js';
  import type { Enums } from '$lib/types/types.js';
  import { page } from '$app/stores';
  import SearchIcon from '~icons/ri/search-line';
  import CloseCircleIcon from '~icons/ri/close-circle-fill';

  $: currentTag = $page.url.searchParams.get('tag') as Enums<'tags'> | null;

  const tagOrder: Enums<'tags'>[] = [
    'transition_mtf',
    'transition_ftm',
    'valence_up',
    'valence_down',
    'tempo_up',
    'tempo_down',
    'duration_up',
    'duration_down',
    'key_change',
    'energy_up',
    'energy_down'
  ];

  const tags = Object.keys(TAGS) as Enums<'tags'>[];
  const sortedTags = tags.sort((a, b) => {
    const indexA = tagOrder.indexOf(a);
    const indexB = tagOrder.indexOf(b);

    // If both elements are in the predefined order, sort based on their indices
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one element is in the predefined order, it comes first
    if (indexA !== -1) {
      return -1;
    }
    if (indexB !== -1) {
      return 1;
    }

    // If neither element is in the predefined order, maintain their original order
    return 0;
  });

  const {
    elements: { trigger: tooltipTrigger, content: tooltipContent },
    states: { open: tooltipOpen }
  } = createTooltip({
    openDelay: 0,
    positioning: { placement: 'bottom-end', gutter: 8 },
    disableHoverableContent: true,
    portal: 'header'
  });
</script>

<header>
  <Logo />
  <nav>
    <label aria-label="Search" class="searchWrapper">
      <div class="searchIcon">
        <SearchIcon />
      </div>
      <input class="searchInput" id="search" type="search" placeholder="Search covers" />
    </label>
    <div class="tags">
      {#if currentTag}
        <a class="tag active" href={'/'}>
          {TAGS[currentTag].label}
          <CloseCircleIcon />
        </a>
      {/if}
      <div class="scrollable">
        {#each sortedTags as tag}
          <a class="tag" href={`/?tag=${tag}`}>
            {TAGS[tag].label}
          </a>
        {/each}
      </div>
    </div>
    <a href="/new" class="button" use:melt={$tooltipTrigger} aria-label="New cover">
      <AddIcon />
    </a>
    {#if $tooltipOpen}
      <div use:melt={$tooltipContent} transition:fade={{ duration: 100 }} class="tooltip">
        New cover
      </div>
    {/if}
  </nav>
</header>

<style lang="scss">
  header {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: var(--mauve-1);
    display: flex;
    align-items: center;
    gap: var(--space-m);
    padding-block: var(--space-s);
    padding-inline-start: var(--space-m);
    padding-inline-end: var(--space-m);
    @supports (padding: max(0px)) {
      padding-inline-start: max(var(--space-m), env(safe-area-inset-left));
      padding-inline-end: max(var(--space-m), env(safe-area-inset-right));
    }
  }

  nav {
    flex: 1;
    min-width: 0;
    display: grid;
    grid-template-areas:
      'search new'
      'tags tags';
    grid-template-columns: 1fr var(--space-2xl);
    column-gap: var(--space-s);
  }

  .searchWrapper {
    grid-area: search;
    display: flex;
    align-items: center;
    gap: var(--space-s);
    background: var(--mauve-3);
    border-radius: var(--radius-full);
    height: var(--space-2xl);
    padding-inline: var(--space-m);

    &:focus-within {
      outline: 3px solid var(--violet-a9);
      outline-offset: 3px;
    }
  }

  .searchIcon {
    flex-shrink: 0;
    fill: currentColor;
  }

  .searchInput {
    background: transparent;
    border: none;
    flex: 1;
    height: 100%;

    &::placeholder {
      color: var(--mauve-8);
    }

    &:focus {
      outline: none;
    }
  }

  .button {
    all: unset;
    grid-area: new;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--mauve-12);
    color: var(--mauve-1);
    line-height: 1;
    font-weight: var(--font-weight-bold);
    height: var(--space-2xl);
    width: var(--space-2xl);
    border-radius: var(--radius-full);

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background: var(--violet-9);
        color: white;
      }
    }

    &:focus {
      outline: 3px solid var(--violet-a9);
      outline-offset: 3px;
    }
  }

  .tooltip {
    background: var(--mauve-12);
    color: var(--mauve-1);
    padding: var(--space-2xs) var(--space-xs);
    border-radius: var(--radius-s);
    font-size: var(--step--1);
    font-weight: var(--font-weight-bold);
  }

  .tags {
    grid-area: tags;
    margin-block-start: var(--space-s);
    display: flex;
    align-items: flex-start;
    gap: var(--space-s);

    .scrollable {
      padding-block-end: var(--space-m);
      margin-block-end: calc(var(--space-m) * -1);
      display: flex;
      align-items: flex-start;
      gap: var(--space-s);
      overflow-x: scroll;
      margin-inline-end: calc(var(--space-m) * -1);
      padding-inline-end: var(--space-m);
      @supports (padding: max(0px)) {
        padding-inline-end: max(var(--space-m), env(safe-area-inset-right));
        margin-inline-end: calc(max(var(--space-m), env(safe-area-inset-right)) * -1);
      }
    }
  }

  .tag {
    all: unset;
    display: inline-flex;
    gap: var(--space-2xs);
    align-items: center;
    background: var(--mauve-3);
    color: var(--mauve-11);
    height: var(--space-xl);
    padding-inline: var(--space-s);
    border-radius: var(--radius-full);
    font-size: var(--step--1);
    flex-shrink: 0;
    text-wrap: nowrap;

    &:hover {
      background: var(--mauve-4);
      cursor: pointer;
    }

    &.active {
      background: var(--mauve-12);
      color: var(--mauve-1);
      padding-inline-end: var(--space-xs);
    }
  }
</style>

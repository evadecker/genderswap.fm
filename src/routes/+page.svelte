<script lang="ts">
  import { page } from '$app/stores';
  import CoverCard from '$lib/components/CoverCard.svelte';
  import { goto } from '$app/navigation';
  import { TAGS } from '$lib/constants.js';
  import type { Enums } from '$lib/types/types.js';
  import SearchIcon from '~icons/ri/search-line';
  import CloseCircleIcon from '~icons/ri/close-circle-fill';

  export let data;

  $: currentPage = Number($page.url.searchParams.get('page')) || 1;
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

  const handleBack = () => {
    if (currentPage > 1) {
      const newURL = new URL($page.url);
      const newPage = currentPage - 1;

      newPage === 1
        ? newURL.searchParams.delete('page')
        : newURL.searchParams.set('page', newPage.toString());

      goto(newURL);
    }
  };

  const handleNext = () => {
    const newURL = new URL($page.url);
    newURL.searchParams.set('page', (currentPage + 1).toString());
    goto(newURL);
  };
</script>

<svelte:head>
  <title>Genderswap.fm</title>
  <meta name="description" content="Some covers deliver the age-old simple pleasures of drag." />
  <link rel="canonical" href="https://genderswap.fm" />
  <meta property="og:image" content={`${$page.url.origin}/og-image.png`} />
  <meta property="og:image:alt" content="Genderswap.fm" />
</svelte:head>

<header>
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
</header>
{#await data}
  <div class="coversGrid">
    {#each [...Array(12)] as []}
      <CoverCard />
    {/each}
  </div>
{:then value}
  {#if value.covers === null || value.covers.length === 0}
    <div class="empty">
      <p>No covers found.</p>
      <a href="/new" class="button">Add a cover</a>
    </div>
  {:else}
    <div class="coversGrid">
      {#each value.covers as cover}
        <CoverCard original={cover.original} cover={cover.cover} slug={cover.slug} />
      {/each}
    </div>
    <div class="pagination">
      {#if data.totalCount}
        <div class="viewingCount">
          Viewing {data.from + 1}–{Math.min(data.to + 1, data.totalCount)} of{' '}
          {data.totalCount} covers
        </div>
      {/if}
      {#if !(data.isFirst && data.isLast)}
        <div class="buttons">
          <button type="button" disabled={data.isFirst} on:click={handleBack}> Back </button>
          <button type="button" disabled={data.isLast} on:click={handleNext}> Next </button>
        </div>
      {/if}
    </div>
  {/if}
{:catch error}
  {error.message}
{/await}

<style lang="scss">
  header {
    padding-block-start: var(--space-l);
    padding-inline: var(--space-m);
  }

  .searchWrapper {
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

  .tags {
    margin-block-start: var(--space-s);
    display: flex;
    align-items: flex-start;
    gap: var(--space-s);
    position: relative;

    .scrollable {
      padding-block-end: var(--space-m);
      margin-block-end: calc(var(--space-m) * -1);
      display: flex;
      align-items: flex-start;
      gap: var(--space-2xs);
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

  .coversGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(var(--space-3xl) * 4), 1fr));
    align-items: center;
    gap: var(--space-xl);
    row-gap: var(--space-2xl);
    padding-block: var(--space-2xl);
    @supports (padding: max(0px)) {
      padding-inline-start: max(var(--space-l), env(safe-area-inset-left));
      padding-inline-end: max(var(--space-l), env(safe-area-inset-right));
    }
    @media (max-width: 1100px) {
      grid-template-columns: repeat(auto-fill, minmax(calc(var(--space-3xl) * 3.5), 1fr));
    }
    @media (max-width: 580px) {
      grid-template-columns: repeat(auto-fill, minmax(calc(var(--space-3xl) * 3), 1fr));
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex: 1;
    gap: var(--space-l);
    padding-block-end: var(--space-3xl);

    p {
      font-size: var(--step-1);
    }
  }

  .button {
    background: var(--mauve-12);
    color: var(--mauve-1);
    border: none;
    cursor: pointer;
    border-radius: var(--radius-full);
    padding-block: var(--space-s);
    padding-inline: var(--space-xl);
    margin-inline: auto;
    font-size: var(--step-1);
    font-weight: var(--font-weight-bold);

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

  .pagination {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    align-items: center;
    margin-inline: auto;
    margin-block-end: var(--space-xl);

    .buttons {
      display: flex;
      gap: var(--space-s);
    }

    button {
      background: var(--mauve-12);
      color: var(--mauve-1);
      border: none;
      cursor: pointer;
      border-radius: var(--radius-full);
      padding-block: var(--space-s);
      padding-inline: var(--space-xl);
      font-size: var(--step-1);
      font-weight: var(--font-weight-bold);

      @media (hover: hover) and (pointer: fine) {
        &:not([disabled]):hover {
          background: var(--violet-9);
          color: white;
        }
      }

      &[disabled] {
        opacity: 0.3;
        cursor: default;
      }

      &:focus {
        outline: 3px solid var(--violet-a9);
        outline-offset: 3px;
      }
    }
  }
</style>

<script lang="ts">
  import { page } from '$app/stores';
  import CoverCard from '$lib/components/CoverCard.svelte';
  import { goto } from '$app/navigation';
  import { TAGS } from '$lib/constants.js';
  import type { Enums } from '$lib/types/types.js';
  import SearchIcon from '~icons/ri/search-line';
  import CloseCircleIcon from '~icons/ri/close-circle-fill';
  import { scale } from 'svelte/transition';
  import type {
    FocusEventHandler,
    FormEventHandler,
    KeyboardEventHandler
  } from 'svelte/elements.js';

  export let data;

  $: currentQuery = $page.url.searchParams.get('q') || '';
  $: currentPage = Number($page.url.searchParams.get('page')) || 1;
  $: currentTag = $page.url.searchParams.get('tag') as Enums<'tags'> | null;

  const tagGroups: Enums<'tags'>[][] = [
    ['transition_mtf', 'transition_ftm'],
    ['valence_up', 'valence_down'],
    ['tempo_up', 'tempo_down'],
    ['duration_up', 'duration_down'],
    ['key_change'],
    ['time_signature_change'],
    ['energy_up', 'energy_down'],
    ['acousticness_up', 'acousticness_down'],
    ['danceability_up', 'danceability_down'],
    ['instrumentalness_up', 'instrumentalness_down'],
    ['years_apart_10', 'years_apart_20', 'years_apart_30', 'years_apart_40', 'years_apart_50'],
    ['transition_mtm', 'transition_ftf']
  ];

  let debounceTimer: ReturnType<typeof setTimeout>;
  const debounce = (callback: () => void) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, 250);
  };

  const handleClearSearch = () => {
    const newURL = new URL($page.url);
    newURL.searchParams.delete('tag');
    newURL.searchParams.delete('q');
    goto(newURL, { keepFocus: true });
  };

  // const handleSearchFocus: FocusEventHandler<HTMLInputElement> = (e) => {
  //   const input = e.currentTarget;
  //   input.selectionStart = 0;
  //   input.selectionEnd = input.value.length;
  // };

  const handleSearchKeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Backspace' && currentQuery === '') {
      handleClearSearch();
    }
  };

  const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
    currentQuery = e.currentTarget.value;
    const newURL = new URL($page.url);

    if (currentQuery) {
      newURL.searchParams.set('q', currentQuery);
    } else {
      newURL.searchParams.delete('q');
    }

    debounce(() => goto(newURL, { keepFocus: true }));
  };

  const handleTagClick = (tag: Enums<'tags'> | null) => {
    const newURL = new URL($page.url);

    if (currentTag === tag || tag === null) {
      newURL.searchParams.delete('tag');
    } else {
      newURL.searchParams.set('tag', tag);
    }

    goto(newURL);
  };

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
  <div aria-label="Search" class="searchWrapper">
    <div class="searchIcon">
      <SearchIcon />
    </div>
    {#if currentTag}
      <button class="tag active" on:click={() => handleTagClick(null)}
        >{TAGS[currentTag].label}
        <span class="close">
          <CloseCircleIcon />
        </span>
      </button>
    {/if}
    <input
      class="searchInput"
      id="search"
      type="search"
      placeholder="Search covers…"
      value={currentQuery}
      on:input={handleSearch}
      on:keydown={handleSearchKeydown}
    />
    {#if currentQuery.length > 0}
      <button
        class="searchClear"
        on:click={handleClearSearch}
        transition:scale={{ duration: 200, start: 0.5 }}
      >
        <CloseCircleIcon />
      </button>
    {/if}
  </div>
  <div class="tags">
    {#each tagGroups as tagGroup}
      <div class="tag-group">
        {#each tagGroup as tag}
          <button
            class="tag"
            class:selected={currentTag === tag}
            on:click={() => handleTagClick(tag)}
            title={TAGS[tag].description}
          >
            {TAGS[tag].shortLabel ?? TAGS[tag].label}
          </button>
        {/each}
      </div>
    {/each}
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
      {#each value.covers as cover, index}
        <CoverCard
          original={cover.original}
          cover={cover.cover}
          slug={cover.slug}
          lazy={index > 5}
        />
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
    padding-inline: var(--space-m);
  }

  .searchWrapper {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    background: var(--mauve-3);
    border-radius: var(--radius-full);
    height: calc(var(--space-2xl) + var(--space-s));
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

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      -webkit-appearance: none;
    }

    &:focus {
      outline: none;
    }
  }

  .searchClear {
    all: unset;
    cursor: pointer;
    color: var(--mauve-11);
    flex-shrink: 0;

    &:hover {
      color: var(--mauve-12);
    }
  }

  .tags {
    margin-block-start: var(--space-s);
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--space-2xs);
    overflow-x: scroll;
    margin-inline: calc(var(--space-m) * -1);
    padding-inline: var(--space-m);
    @supports (padding: max(0px)) {
      padding-inline: max(var(--space-m), env(safe-area-inset-right));
      margin-inline: calc(max(var(--space-m), env(safe-area-inset-right)) * -1);
    }
    // Hide scrollbars on Chrome, Safari
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none; // Edge
    scrollbar-width: none; // Firefox
  }

  .tag-group {
    display: flex;
    align-items: flex-start;
    min-width: 0;
    flex-shrink: 0;
    background: var(--mauve-3);
    border-radius: var(--radius-s);
  }

  .tag {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2xs);
    background: var(--mauve-3);
    color: var(--mauve-11);
    padding-block: var(--space-2xs);
    padding-inline: var(--space-s);
    border-radius: var(--radius-s);
    position: relative;
    flex-shrink: 0;
    min-width: 0;

    &:not(.selected):not(:hover) + :not(.selected):not(:hover)::before {
      content: '';
      height: 50%;
      width: 1px;
      background: var(--mauve-6);
      position: absolute;
      left: -0.5px;
    }

    &:hover {
      background: var(--mauve-4);
      cursor: pointer;

      .close {
        color: var(--mauve-1);
      }
    }

    &.selected {
      background: var(--mauve-5);
    }

    &.active {
      background: var(--mauve-12);
      color: var(--mauve-1);
    }

    .close {
      color: var(--mauve-9);
      font-size: 0.8em;
    }
  }

  .coversGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(var(--space-3xl) * 4), 1fr));
    grid-template-rows: max-content;
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
      font-feature-settings: var(--font-unstable);

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

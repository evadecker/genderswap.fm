<script lang="ts">
  import { page } from '$app/stores';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import CoverCard from '$lib/components/CoverCard.svelte';
  import { goto } from '$app/navigation';
  import TagCloud from '$lib/components/TagCloud.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import { TAGS } from '$lib/constants.js';
  import type { Enums } from '$lib/types/types.js';
  import { createCollapsible, melt } from '@melt-ui/svelte';
  import { slide } from 'svelte/transition';
  import ArrowDropDown from '~icons/ri/arrow-drop-down-line';
  import ArrowDropUp from '~icons/ri/arrow-drop-up-line';

  export let data;

  const tags = Object.keys(TAGS) as Enums<'tags'>[];

  $: currentPage = Number($page.url.searchParams.get('page')) || 1;
  $: currentTag = $page.url.searchParams.get('tag') as Enums<'tags'> | null;

  const {
    elements: { root, content, trigger },
    states: { open }
  } = createCollapsible();

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
  <meta property="og:image" content="%sveltekit.assets%/og-image.png" />
  <meta property="og:image:alt" content="Genderswap.fm" />
</svelte:head>

<PageHeader
  title="Genderswap.fm"
  description="Some covers deliver the age-old simple pleasures of drag."
>
  <div use:melt={$root}>
    <button use:melt={$trigger} class="toggle">
      <span>Filter by tag</span>
      {#if $open}
        <ArrowDropUp />
      {:else}
        <ArrowDropDown />
      {/if}
    </button>
    {#if $open}
      <div use:melt={$content} transition:slide>
        <TagCloud>
          {#each tags as tag}
            <Tag
              text={TAGS[tag].label}
              url={currentTag === tag ? '/' : `/?tag=${tag}`}
              isActive={currentTag === tag}
            />
            <!-- count={count?.toString()}  -->
          {/each}
        </TagCloud>
      </div>
    {/if}
  </div>
</PageHeader>

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
      <a href="/random" class="button">Get random cover</a>
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
  .toggle {
    all: unset;
    display: inline-flex;
    gap: var(--space-xs);
    align-items: center;
    background: var(--mauve-3);
    color: var(--mauve-11);
    padding-block: var(--space-2xs);
    padding-inline: var(--space-l);
    padding-inline-end: var(--space-s);
    border-radius: var(--radius-full);
    font-size: var(--step-0);

    &:hover {
      background: var(--mauve-4);
      cursor: pointer;
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

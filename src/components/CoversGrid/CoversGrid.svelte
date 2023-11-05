<script lang="ts">
  import CoverCard from "./CoverCard.svelte";
  import { supabase } from "../../lib/supabase";
  import type { Enums, Tables } from "../../types/types";

  type GridItem = {
    original: Tables<"songs">;
    cover: Tables<"songs">;
    slug: string;
  };

  export let filterBy: Enums<"tags"> | null = null;

  const COVERS_PER_PAGE = 60;
  const SKELETON_COVERS = 12;

  let page =
    Number(new URLSearchParams(window.location.search).get("page")) || 1;
  let loadedCovers: GridItem[] = [];
  let range = { from: 0, to: COVERS_PER_PAGE - 1 };
  let totalCovers = 0;
  let isLoading = false;
  let isFirst = page === 1;
  let isLast = false;

  const getTotalCovers = async () => {
    const covers = supabase
      .from("covers")
      .select("id", { count: "exact", head: true });

    if (filterBy) {
      covers.overlaps("tags", [filterBy]);
    }

    const { count } = await covers;

    if (count) totalCovers = count;
  };

  const fetchCovers = async () => {
    if (isLoading) return;
    isLoading = true;

    const newFrom = (page - 1) * COVERS_PER_PAGE;
    const newTo = newFrom + COVERS_PER_PAGE - 1;
    range = { from: newFrom, to: newTo };

    try {
      const covers = supabase
        .from("covers")
        .select(
          `
          slug,
          original:original_id(id, name, artists, album_name, album_img),
          cover:cover_id(id, name, artists, album_name, album_img)
        `
        )
        .order("created_at", { ascending: false })
        .range(newFrom, newTo);

      if (filterBy) {
        covers.overlaps("tags", [filterBy]);
      }

      const { data } = await covers.returns<GridItem[]>();

      if (data) loadedCovers = [...loadedCovers, ...data];
      if (!data || data.length < COVERS_PER_PAGE) isLast = true;

      isLoading = false;
    } catch (error) {
      console.error(error);
    }
  };

  fetchCovers();
  getTotalCovers();

  const handleBack = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const newPage = page - 1;
    if (newPage === 1) {
      searchParams.delete("page");
    } else {
      searchParams.set("page", newPage.toString());
    }
    window.location.search = searchParams.toString();
    page = newPage;
  };

  const handleNext = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const newPage = page + 1;
    searchParams.set("page", newPage.toString());
    window.location.search = searchParams.toString();
    page = newPage;
  };
</script>

{#if !isLoading && loadedCovers.length === 0}
  <div class="empty">
    <p>No covers found.</p>
    <a href="/random" class="button">Get random cover</a>
  </div>
{:else}
  <div class="coversGrid">
    {#if isLoading}
      {#each [...Array(SKELETON_COVERS)] as []}
        <CoverCard />
      {/each}
    {:else}
      {#each loadedCovers as loadedCover}
        <CoverCard
          original={loadedCover.original}
          cover={loadedCover.cover}
          slug={loadedCover.slug}
        />
      {/each}
      <div class="pagination">
        <div class="viewingCount">
          Viewing {range.from + 1}–{Math.min(range.to + 1, totalCovers)} of{" "}
          {totalCovers} covers
        </div>
        {#if !(isFirst && isLast)}
          <div class="buttons">
            <button type="button" disabled={isFirst} on:click={handleBack}>
              Back
            </button>
            <button type="button" disabled={isLast} on:click={handleNext}>
              Next
            </button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .coversGrid {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(calc(var(--space-3xl) * 4), 1fr)
    );
    align-items: center;
    gap: var(--space-xl);
    row-gap: var(--space-2xl);
    padding-block: var(--space-2xl);
    @supports (padding: max(0px)) {
      padding-inline-start: max(var(--space-l), env(safe-area-inset-left));
      padding-inline-end: max(var(--space-l), env(safe-area-inset-right));
    }
    @media (max-width: 1100px) {
      grid-template-columns: repeat(
        auto-fill,
        minmax(calc(var(--space-3xl) * 3.5), 1fr)
      );
    }
    @media (max-width: 580px) {
      grid-template-columns: repeat(
        auto-fill,
        minmax(calc(var(--space-3xl) * 3), 1fr)
      );
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

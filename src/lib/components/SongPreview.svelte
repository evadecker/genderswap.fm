<script lang="ts">
  import { smartquotes } from '$lib/helpers';
  import type { Track } from '@spotify/web-api-ts-sdk';
  import { fade, slide } from 'svelte/transition';
  import CloseCircleIcon from '~icons/ri/close-circle-line';
  import HistoryIcon from '~icons/ri/history-line';
  import CheckIcon from '~icons/ri/check-line';
  import type { MouseEventHandler } from 'svelte/elements';

  export let song: Track;
  export let earlierRelease: Promise<Track | null> | null = null;
  export let onUseEarlierRelease: (e) => void;
  export let onClearSelection: () => void;

  let useEarlierReleaseClicked = false;

  const getYearsBefore = (selectedReleaseDate: string, earliestReleaseDate: string) => {
    const yearsDiff =
      parseInt(selectedReleaseDate.slice(0, 4)) - parseInt(earliestReleaseDate.slice(0, 4));

    return `${yearsDiff} year${yearsDiff === 1 ? '' : 's'} earlier`;
  };

  const handleUseEarlierRelease: MouseEventHandler<HTMLButtonElement> = (e) => {
    onUseEarlierRelease(e);
    useEarlierReleaseClicked = true;
  };
</script>

<div class="selectedSong">
  <div class="selectedSongContents">
    <img class="selectedAlbum" src={song.album.images[0].url} alt={song.name} />
    <div class="selectedLabel">
      <div class="selectedName">{smartquotes(song.name)}</div>
      <div>{song.artists.map((artist) => artist.name).join(', ')}</div>
      <div class="selectedAlbumNameAndYear">
        <em>{smartquotes(song.album.name)}</em> &middot;{' '}
        {song.album.release_date.slice(0, 4)}
      </div>
    </div>
    <button class="clearSelection" on:click={onClearSelection} aria-label="Remove selection">
      <CloseCircleIcon />
    </button>
  </div>
  {#await earlierRelease then earlier}
    {#if earlier}
      <div class="earlierReleaseBanner" transition:slide>
        {#if earlier.id === song.id || useEarlierReleaseClicked}
          <div class="bannerContents">
            <CheckIcon />
            <div class="bannerLabel">
              <strong class="bannerTitle">This is the earliest release.</strong>
            </div>
          </div>
        {:else}
          <div class="bannerContents">
            <HistoryIcon />
            <div class="bannerLabel">
              <strong class="bannerTitle">There’s an earlier release!</strong>
              <p>
                A version of {earlier.artists[0].name}’s
                <strong>{earlier.name}</strong>
                was released in <strong>{earlier.album.release_date.slice(0, 4)}</strong> on
                <strong>{earlier.album.name}</strong>—{getYearsBefore(
                  song.album.release_date,
                  earlier.album.release_date
                )}.
              </p>
            </div>
          </div>
          <button on:click={handleUseEarlierRelease}>Use earlier release</button>
        {/if}
      </div>
    {/if}
  {/await}
</div>

<style lang="scss">
  .selectedSong {
    background: var(--mauve-3);
    border-radius: var(--radius-l);
    overflow: hidden;
  }

  .selectedSongContents {
    padding: var(--space-m);
    display: grid;
    grid-template: 'album content clear';
    grid-template-columns: auto 1fr var(--space-2xl);
    align-items: center;
    gap: var(--space-m);
  }

  .selectedAlbum {
    border-radius: var(--radius-2xs);
    width: calc(var(--space-3xl) * 2);
    height: calc(var(--space-3xl) * 2);
    flex-shrink: 0;
    min-width: none;
  }

  .selectedLabel {
    display: flex;
    flex-direction: column;
    flex: 1;
    grid-area: content;
  }

  .selectedName {
    font-size: var(--step-1);
    font-weight: var(--font-weight-bold);
    line-height: 1;
    margin-block-end: var(--space-xs);
  }

  .clearSelection {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: transparent;
    width: var(--space-2xl);
    height: var(--space-2xl);
    border-radius: var(--radius-full);
    cursor: pointer;
    line-height: 0;
    color: var(--mauve-11);

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background: var(--mauve-4);
      }
    }
  }

  .earlierReleaseBanner {
    border-top: 2px solid var(--mauve-6);
    padding: var(--space-m);
    display: flex;
    flex-direction: column;

    .bannerContents {
      display: flex;
      gap: var(--space-m);
    }

    .bannerLabel {
      flex: 1;
    }

    p {
      font-size: var(--step--1);
    }

    button {
      all: unset;
      cursor: pointer;
      text-align: center;
      padding: var(--space-s) var(--space-m);
      background: var(--mauve-12);
      color: var(--mauve-1);
      border-radius: var(--radius-s);
      margin-block-start: var(--space-m);
      font-weight: var(--font-weight-bold);

      &:hover {
        background: var(--violet-9);
        color: var(--mauve-12);
      }
    }
  }
</style>

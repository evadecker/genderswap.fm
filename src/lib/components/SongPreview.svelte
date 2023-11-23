<script lang="ts">
  import { getYearsEarlierText, smartquotes } from '$lib/helpers';
  import type { Track } from '@spotify/web-api-ts-sdk';
  import { slide } from 'svelte/transition';
  import CloseCircleIcon from '~icons/ri/close-circle-line';
  import HistoryIcon from '~icons/ri/history-line';
  import CheckIcon from '~icons/ri/check-line';
  import type { MouseEventHandler } from 'svelte/elements';

  export let song: Track;
  export let earlierRelease: Promise<Track | null> | null = null;
  export let onUseEarlierRelease: () => void;
  export let onClearSelection: () => void;

  let wasKeepThisReleaseClicked = false;
  let wasEarlierReleaseClicked = false;

  const handleKeepThisRelease: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    wasKeepThisReleaseClicked = true;
  };

  const handleUseEarlierRelease: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    onUseEarlierRelease();
    wasEarlierReleaseClicked = true;
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
    {#if earlier && !wasKeepThisReleaseClicked}
      <div class="earlierReleaseBanner" transition:slide>
        {#if earlier.id === song.id || wasEarlierReleaseClicked}
          <div class="bannerContents">
            <CheckIcon />
            <div class="bannerLabel">
              <strong class="bannerTitle">Earliest release available on Spotify</strong>
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
                was released {getYearsEarlierText(
                  song.album.release_date,
                  earlier.album.release_date
                )} in <strong>{earlier.album.release_date.slice(0, 4)}</strong> on the album
                <strong>{earlier.album.name}</strong>.
              </p>
            </div>
          </div>
          <div class="bannerActions">
            <button on:click={handleKeepThisRelease} class="secondary">Keep newer release</button>
            <button on:click={handleUseEarlierRelease} class="primary">Use earlier release</button>
          </div>
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
    border-radius: var(--radius-album);
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
    border-top: 1px solid var(--mauve-6);
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
  }

  .bannerActions {
    margin-block-start: var(--space-m);
    display: flex;
    gap: var(--space-s);
    flex-wrap: wrap;

    button {
      all: unset;
      flex: 1;
      cursor: pointer;
      text-align: center;
      padding: var(--space-s) var(--space-m);
      border-radius: var(--radius-s);

      font-weight: var(--font-weight-bold);
      text-wrap: nowrap;

      &.primary {
        background: var(--mauve-12);
        color: var(--mauve-1);

        &:hover {
          background: var(--violet-9);
          color: var(--mauve-12);
        }
      }

      &.secondary {
        background: var(--mauve-5);

        &:hover {
          background: var(--mauve-6);
        }
      }
    }
  }
</style>

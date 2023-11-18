<script lang="ts">
  import { smartquotes } from '$lib/helpers';
  import type { Track } from '@spotify/web-api-ts-sdk';

  export let song: Track;
  export let onClearSelection: () => void;
</script>

<div class="selectedSong">
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path
        d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"
      />
    </svg>
  </button>
</div>

<style lang="scss">
  .selectedSong {
    background: var(--mauve-3);
    border-radius: var(--radius-l);
    padding: var(--space-m);
    display: grid;
    grid-template: 'album content clear';
    grid-template-columns: var(--space-3xl) 1fr var(--space-2xl);
    align-items: flex-start;
    gap: var(--space-m);
  }

  .selectedAlbum {
    border-radius: var(--radius-xs);
    width: var(--space-3xl);
    height: var(--space-3xl);
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
</style>

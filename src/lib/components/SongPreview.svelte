<script lang="ts">
  import { smartquotes } from '$lib/helpers';
  import type { Track } from '@spotify/web-api-ts-sdk';
  import CloseCircleIcon from '~icons/ri/close-circle-line';

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
    <CloseCircleIcon />
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

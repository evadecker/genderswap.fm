<script lang="ts">
  import { slugify, smartquotes } from '$lib/helpers';
  import type { Cover } from '../../routes/cover/[slug]/+page.server';
  import SpotifyIcon from '~icons/ri/spotify-fill';

  export let cover: Cover;

  const { original: originalSong, cover: coverSong } = cover;

  let coveredAs: string;
  if (slugify(originalSong.name) !== slugify(coverSong.name)) {
    coveredAs = coverSong.name;
  }
</script>

<div class="compare">
  <div
    class="track original"
    itemprop="track"
    itemscope
    itemtype="https://schema.org/MusicRecording"
  >
    <div class="album">
      <img
        class="album-art"
        src={originalSong.album_img[0]}
        alt={`${originalSong.album_name} album art`}
        itemprop="image"
      />
    </div>
    <div class="details">
      <a href={originalSong.url} itemprop="url" aria-label="Open in Spotify" class="song-link">
        <SpotifyIcon />
        Listen to original
      </a>
      <h2 class="artist" itemprop="byArtist">
        {smartquotes(originalSong.artists.join(', ')) ?? 'Loading...'}
      </h2>
      <time class="album-year" itemprop="datePublished">
        {originalSong.album_year}
      </time>
      <em class="album-name">{smartquotes(originalSong.album_name)}</em>
    </div>
  </div>
  <div class="track cover" itemprop="track" itemscope itemtype="https://schema.org/MusicRecording">
    <div class="album">
      <img
        class="album-art"
        src={coverSong.album_img[0]}
        alt={`${coverSong.album_name} album art`}
        itemprop="image"
      />
    </div>
    <div class="details">
      <a href={coverSong.url} itemprop="url" aria-label="Open in Spotify" class="song-link">
        <SpotifyIcon />
        Listen to cover
      </a>
      <h2 class="artist" itemprop="byArtist">
        {smartquotes(coverSong.artists.join(', ')) ?? 'Loading...'}
      </h2>
      <time class="album-year" itemprop="datePublished">
        {coverSong.album_year}
      </time>
      <em class="album-name">{smartquotes(coverSong.album_name)}</em>
      {#if coveredAs}
        <div class="covered-as" itemprop="name">
          Covered as <strong>{smartquotes(coveredAs)}</strong>
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @keyframes dim {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0.4;
    }
  }

  .compare {
    display: grid;
    max-width: 100%;
    margin-inline: auto;
    padding-inline: var(--space-xl);
    @supports (padding: max(0px)) {
      padding-inline-start: max(var(--space-xl), env(safe-area-inset-left));
      padding-inline-end: max(var(--space-xl), env(safe-area-inset-right));
    }
    scroll-padding-inline: var(--space-xl);
    gap: var(--space-l);
    grid-template:
      'originalAlbum coverAlbum'
      'originalContent coverContent';
    grid-template-columns: 1fr 1fr;

    @media (max-width: 480px) {
      overflow-x: scroll;
      overflow-y: hidden;
      grid-template-columns: 85vw 85vw;
      scroll-snap-type: x mandatory;
      // Hide scrollbars on Chrome, Safari
      &::-webkit-scrollbar {
        display: none;
      }
      -ms-overflow-style: none; // Edge
      scrollbar-width: none; // Firefox
    }
  }

  .track {
    max-width: 600px;
  }

  .track:first-child {
    scroll-snap-align: start;
    @supports (animation-timeline: scroll()) {
      animation: dim linear both;
      animation-direction: normal;
      animation-timeline: scroll(x);
    }
  }

  .track:last-child {
    scroll-snap-align: end;
    @supports (animation-timeline: scroll()) {
      animation: dim linear both;
      animation-direction: reverse;
      animation-timeline: scroll(x);
    }
  }

  .album {
    user-select: none;
    width: 100%;
    aspect-ratio: 1 / 1;
    background: var(--mauve-3);
    overflow: hidden;
    border-radius: var(--radius-album);
    position: relative;
    z-index: 1;
    box-shadow: 0px 1.7px 2.2px rgba(0, 0, 0, 0.02), 0px 4px 5.3px rgba(0, 0, 0, 0.028),
      0px 7.5px 10px rgba(0, 0, 0, 0.035), 0px 13.4px 17.9px rgba(0, 0, 0, 0.042),
      0px 25.1px 33.4px rgba(0, 0, 0, 0.05), 0px 60px 80px rgba(0, 0, 0, 0.07);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .original {
    .album {
      grid-area: originalAlbum;
      margin-inline-start: auto;
    }
    .details {
      grid-area: originalContent;
      align-items: flex-end;
      text-align: right;
    }
  }

  .cover {
    .album {
      grid-area: coverAlbum;
    }
    .details {
      grid-area: coverContent;
    }
  }

  .details {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    align-items: flex-start;
    padding-block-start: var(--space-l);
  }

  .artist {
    font-size: var(--step-3);
  }

  .album-year,
  .album-name {
    font-size: var(--step-1);
  }

  .song-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-s);
    padding-inline-end: var(--space-m);
    background-color: var(--mauve-3);
    border-radius: var(--radius-full);
    font-weight: var(--font-weight-bold);

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: var(--pink-3);
        color: var(--pink-12);
      }
    }

    :global(svg) {
      width: var(--space-xl);
    }
  }

  .covered-as {
    color: var(--mauve-11);
  }
</style>

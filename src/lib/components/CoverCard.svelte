<script lang="ts">
  import { smartquotes } from '$lib/helpers';

  type Album = {
    name: string;
    artists: string[];
    album_img: string[];
  };

  export let original: Album | null = null;
  export let cover: Album | null = null;
  export let slug: string | null = null;
  export let lazy: boolean = false;

  let isSkeleton = false;
  if (!original && !cover && !slug) isSkeleton = true;
</script>

<div class="coverCard" class:placeholder={isSkeleton} aria-hidden={isSkeleton || undefined}>
  <div class="albums">
    <div class="album">
      {#if original?.album_img}
        <img
          src={original.album_img[1]}
          alt={`${original.name} album art`}
          loading={lazy ? 'lazy' : 'eager'}
        />
      {/if}
    </div>
    <div class="album">
      {#if cover?.album_img}
        <img
          src={cover.album_img[1]}
          alt={`${cover.name} album art`}
          loading={lazy ? 'lazy' : 'eager'}
        />
      {/if}
    </div>
  </div>
  <div class="content">
    <h2 class="title">
      {#if original}
        {smartquotes(original.name)}
      {/if}
    </h2>
    <div class="artist">
      {#if cover && original}
        <strong>{cover.artists[0]}</strong> covering{' '}
        <strong>{original.artists[0]}</strong>
      {/if}
    </div>
    {#if !isSkeleton}
      <a class="link" href={`/cover/${slug}`} aria-label={`More about ${original?.name}`} />
    {/if}
  </div>
</div>

<style lang="scss">
  .coverCard {
    position: relative;
    border-radius: var(--radius-m);
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: flex-start;
    gap: var(--space-xl);
    text-align: center;

    @media (hover: hover) and (pointer: fine) {
      &:not(.placeholder):hover {
        .album {
          transform: rotate(0) translateX(0);
        }
      }
    }
  }

  .albums {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    width: 100%;
  }

  .album {
    background: var(--mauve-3);
    border-radius: var(--radius-album);
    aspect-ratio: 1;
    transition: transform 0.2s ease-in-out;
    position: relative;

    &:not(:empty) {
      box-shadow: var(--shadow-album-s);

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: var(--radius-album);
        box-shadow: var(--shadow-album-inset-s);
      }
    }

    img {
      width: 100%;
      height: 100%;
      aspect-ratio: 1;
      border-radius: var(--radius-album);
      object-fit: cover;
    }

    &:first-child {
      width: 40%;
      transform: rotate(-10deg) translateX(6%);
      transform-origin: 100% 0;
    }

    &:last-child {
      width: 60%;
      transform: rotate(6deg) translateX(-6%);
      transform-origin: 0 0;
    }
  }

  @keyframes pulse {
    0% {
      background-color: var(--mauve-4);
    }
    50% {
      background-color: var(--mauve-3);
    }
    100% {
      background-color: var(--mauve-4);
    }
  }

  .album:empty,
  .title:empty,
  .artist:empty {
    animation: pulse 1s ease-in-out infinite;
  }

  .placeholder .album:first-child {
    opacity: 0.6;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    width: 100%;
  }

  .title,
  .artist {
    text-wrap: balance;
    transition: color 0.2s ease;
    width: 100%;
  }

  .title:empty,
  .artist:empty {
    background: var(--mauve-3);
    display: block;
    border-radius: var(--radius-xs);
  }

  .title {
    font-size: var(--step-1);
    font-feature-settings: var(--font-stable);

    &:empty {
      width: 70%;
      height: var(--space-xl);
    }
  }

  .artist {
    color: var(--mauve-11);
    line-height: 1.3;

    &:empty {
      width: 90%;
      height: var(--space-l);
    }
  }

  .link {
    position: absolute;
    inset: 0;
  }
</style>

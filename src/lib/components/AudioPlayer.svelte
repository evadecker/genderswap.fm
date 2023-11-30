<script lang="ts">
  import { currentId } from '$lib/stores/playing';
  import { fly } from 'svelte/transition';
</script>

{#if $currentId}
  <div class="audio-player" transition:fly={{ y: 80 }}>
    <iframe
      style="border-radius: 14px"
      src={`https://open.spotify.com/embed/track/${$currentId}`}
      title="Spotify"
      width="100%"
      height="80"
      frameBorder="0"
      allowfullscreen={null}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    />
  </div>
{/if}

<style lang="scss">
  .audio-player {
    width: 100%;
    height: calc(80px + var(--space-m) * 2);
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--space-m);
    display: flex;
    gap: var(--space-s);
    align-items: center;
    z-index: 80;
    background: linear-gradient(transparent, var(--mauve-1));
  }
</style>

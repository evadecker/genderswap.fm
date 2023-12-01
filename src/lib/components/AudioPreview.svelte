<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  export let src: string;
  export let title: string;

  let state = 'paused';
  let audio: HTMLAudioElement;
  let time = 0;
  let duration: number;

  const play = () => {
    audio.play();
    state = 'playing';
  };

  const pauseAndReset = () => {
    audio.pause();
    audio.currentTime = 0;
    state = 'paused';
  };

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (state === 'paused') {
      play();
    } else {
      pauseAndReset();
    }
  };

  $: percent = (time / duration) * 100;
  $: if (percent > 99.5) pauseAndReset();
</script>

<div
  class="progress"
  role="progressbar"
  aria-valuenow={parseFloat(percent.toFixed(2))}
  aria-valuemin="0"
  aria-valuemax="100"
  style={state === 'playing'
    ? `background: conic-gradient(var(--pink-9) ${percent.toFixed(2)}%, transparent 0)`
    : undefined}
>
  <audio bind:this={audio} bind:currentTime={time} bind:duration {title}>
    <source {src} type="audio/mpeg" />
  </audio>
  <button
    class="playPauseButton"
    class:playing={state === 'playing'}
    on:click={handleButtonClick}
    aria-label={state === 'paused' ? 'Play' : 'Pause'}
  >
    {#if state === 'paused'}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon points="5 3 19 12 5 21 5 3" transform="translate(2 0)" />
      </svg>
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </svg>
    {/if}
  </button>
</div>

<style lang="scss">
  .progress {
    line-height: 0;
    border-radius: var(--radius-full);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    justify-self: center;
    padding: 2.5px;
    margin: -2.5px;
    width: min-content;
    transition: all 0.2s ease-in-out;
  }

  .playPauseButton {
    all: unset;
    cursor: pointer;
    border-radius: var(--radius-full);
    width: var(--space-xl);
    height: var(--space-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2.5px solid var(--mauve-12);
    color: var(--mauve-12);
    transition: all 0.2s ease-in-out;
    font-size: var(--step--1);

    &.playing {
      background: var(--mauve-12);
      color: var(--mauve-1);
      border-color: var(--mauve-3);
    }
  }
</style>

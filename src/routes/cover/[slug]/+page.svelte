<script lang="ts">
  import CoverComparison from '$lib/components/CoverComparison.svelte';
  import dayjs from 'dayjs';
  import TagCloud from '$lib/components/TagCloud.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import { TAGS } from '$lib/constants';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import confetti from 'canvas-confetti';

  export let data;
  const isNew = $page.url.searchParams.get('new') === 'true' ? true : false;

  const formattedDate = dayjs(data.created_at).format('MMMM D, YYYY');

  onMount(async () => {
    const fireConfetti = (placement: 'left' | 'right') => {
      // https://www.flagcolorcodes.com/transgender
      const colors = ['#ffffff', '#5BCEFA', '#F5A9B8'];
      const baseAngle = placement === 'left' ? 70 : 110;
      const origin = placement === 'left' ? { x: -0, y: 1 } : { x: 1, y: 1 };
      const drift = placement === 'left' ? 0.5 : -0.5;

      const sharedProps = {
        particleCount: 100,
        scalar: 0.8,
        angle: baseAngle,
        ticks: 300,
        origin,
        drift,
        colors,
        disableForReducedMotion: true,
        zIndex: 999
      };

      // The strongest blast of confetti, centered on the baseAngle
      confetti({
        ...sharedProps,
        spread: 20,
        startVelocity: 90,
        decay: 0.92
      });

      // A weaker last of confetti with a larger spread
      confetti({
        ...sharedProps,
        spread: 50,
        startVelocity: 60,
        decay: 0.9
      });

      // The weakest blast of confetti
      confetti({
        ...sharedProps,
        spread: 60,
        startVelocity: 40,
        decay: 0.89
      });
    };

    if (isNew) {
      setTimeout(() => fireConfetti('left'), 600);
      setTimeout(() => fireConfetti('right'), 1200);
    }
  });
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta
    name="description"
    content={data.description ?? 'Some covers deliver the age-old simple pleasures of drag.'}
  />
  <link rel="canonical" href={`https://genderswap.fm${$page.url.pathname}`} />
  <meta property="og:image" content={`${$page.url.pathname}/og.png`} />
  <meta property="og:image:alt" content={data.pageTitle} />
</svelte:head>

<header class="header">
  <h1 class="title">{data.pageTitle}</h1>
  <div class="subtitle">
    <strong>{data.cover.artists[0]}</strong> covering{' '}
    <strong>{data.original.artists[0]}</strong>
  </div>
  {#if data.description}
    <p class="description">{data.description}</p>
  {/if}
  {#if data.tags}
    <TagCloud>
      {#each data.tags as tag}
        <Tag text={TAGS[tag].label} url={`/?tag=${tag}`} />
      {/each}
    </TagCloud>
  {/if}
</header>
<CoverComparison cover={data} />
<footer class="footer">
  <span
    >Added {data.contributor && `by ${data.contributor} on `}
    <time datetime={data.created_at}>{formattedDate}</time></span
  >
</footer>

<style lang="scss">
  .header {
    padding-block-start: var(--space-xl);
    padding-block-end: var(--space-3xl);
    padding-inline: var(--space-l);
    @supports (padding: max(0px)) {
      padding-inline-start: max(var(--space-l), env(safe-area-inset-left));
      padding-inline-end: max(var(--space-l), env(safe-area-inset-right));
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    text-wrap: balance;
  }

  .subtitle {
    font-size: var(--step-2);
    line-height: var(--line-height-h3);
    color: var(--mauve-11);
    margin-block-start: var(--space-m);
    margin-block-end: var(--space-l);
    text-wrap: balance;
  }

  .description {
    font-size: var(--step-1);
    text-wrap: balance;
    margin-block-end: var(--space-l);
    max-width: 40ch;
  }

  .footer {
    padding-block: var(--space-2xl);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

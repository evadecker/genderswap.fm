<script lang="ts">
  import CoverComparison from '$lib/components/CoverComparison.svelte';
  import dayjs from 'dayjs';
  import TagCloud from '$lib/components/TagCloud.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import { TAGS } from '$lib/constants';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import confetti from 'canvas-confetti';
  import { getSortedTags } from '$lib/helpers.js';

  export let data;

  const isNew = $page.url.searchParams.get('new') === 'true' ? true : false;

  const formattedDate = dayjs(data.created_at).format('MMMM D, YYYY');

  onMount(async () => {
    const fireConfetti = (placement: 'left' | 'right' | 'bottom') => {
      // https://www.flagcolorcodes.com/transgender
      const colors = ['#ffffff', '#5BCEFA', '#00a4b8', '#007290', '#F5A9B8', '#fc5cdb', '#eb29da'];
      const center = 90;

      const sharedProps = {
        scalar: 0.6,
        ticks: 300,
        colors,
        disableForReducedMotion: true,
        zIndex: 999
      };

      const directionalProps = {
        left: {
          particleCount: 20,
          startVelocity: 45,
          angle: center - 15,
          origin: { x: 0, y: 1 },
          drift: 0.5
        },
        right: {
          particleCount: 20,
          startVelocity: 45,
          angle: center + 15,
          origin: { x: 1, y: 1 },
          drift: -0.5
        },
        bottom: {
          particleCount: 80,
          startVelocity: 80,
          angle: center,
          origin: { x: 0.5, y: 1 },
          drift: 0
        }
      };

      // The strongest blast of confetti, centered on the baseAngle
      confetti({
        ...sharedProps,
        ...directionalProps[placement],
        spread: placement === 'bottom' ? 30 : 20,
        decay: 0.92
      });

      // A weaker last of confetti with a larger spread
      confetti({
        ...sharedProps,
        ...directionalProps[placement],
        spread: placement === 'bottom' ? 50 : 40,
        decay: 0.9
      });

      // The weakest blast of confetti
      confetti({
        ...sharedProps,
        ...directionalProps[placement],
        spread: placement === 'bottom' ? 90 : 80,
        decay: 0.89,
        startVelocity: 30
      });
    };

    if (isNew) {
      setTimeout(() => fireConfetti('left'), 1000);
      setTimeout(() => fireConfetti('right'), 1400);
      setTimeout(() => fireConfetti('bottom'), 2800);
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
      {#each getSortedTags(data.tags) as tag}
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

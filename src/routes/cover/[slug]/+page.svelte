<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import CoverComparison from '$lib/components/CoverComparison.svelte';
  import dayjs from 'dayjs';
  import TagCloud from '$lib/components/TagCloud.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import { TAGS } from '$lib/constants';
  import { page } from '$app/stores';

  export let data;

  const formattedDate = dayjs(data.created_at).format('MMMM D, YYYY');
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

<PageHeader title={data.pageTitle} description={data.description}>
  {#if data.tags}
    <TagCloud>
      {#each data.tags as tag}
        <Tag text={TAGS[tag].label} url={`/?tag=${tag}`} />
      {/each}
    </TagCloud>
  {/if}
</PageHeader>
<CoverComparison cover={data} />
<footer class="footer">
  <span
    >Added {data.contributor && `by ${data.contributor} on `}
    <time datetime={data.created_at}>{formattedDate}</time></span
  >
</footer>

<style>
  .footer {
    padding-block: var(--space-2xl);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

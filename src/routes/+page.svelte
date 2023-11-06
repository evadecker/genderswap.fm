<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import CoverCard from '$lib/components/CoverCard.svelte';
	import { goto } from '$app/navigation';

	export let data;

	$: currentPage = Number($page.url.searchParams.get('page')) || 1;

	const handleBack = () => {
		if (currentPage > 1) {
			const newURL = new URL($page.url);
			const newPage = currentPage - 1;

			newPage === 1
				? newURL.searchParams.delete('page')
				: newURL.searchParams.set('page', newPage.toString());

			goto(newURL);
		}
	};

	const handleNext = () => {
		const newURL = new URL($page.url);
		newURL.searchParams.set('page', (currentPage + 1).toString());
		goto(newURL);
	};
</script>

<svelte:head>
	<title>Genderswap.fm</title>
	<meta name="description" content="Some covers deliver the age-old simple pleasures of drag." />
</svelte:head>

<PageHeader
	title="Genderswap.fm"
	description="Some covers deliver the age-old simple pleasures of drag."
>
	<!-- <TagCloud>
      <Tag text="Explore by tag" url="/tagged" />
      <Tag text="Get random cover" url="/random" />
    </TagCloud> -->
</PageHeader>

{#await data}
	<div class="coversGrid">
		{#each [...Array(12)] as []}
			<CoverCard />
		{/each}
	</div>
{:then value}
	{#if value.covers === null || value.covers.length === 0}
		<div class="empty">
			<p>No covers found.</p>
			<a href="/random" class="button">Get random cover</a>
		</div>
	{:else}
		<div class="coversGrid">
			{#each value.covers as cover}
				<CoverCard original={cover.original} cover={cover.cover} slug={cover.slug} />
			{/each}
		</div>
		<div class="pagination">
			{#if data.totalCount}
				<div class="viewingCount">
					Viewing {data.from + 1}–{Math.min(data.to + 1, data.totalCount)} of{' '}
					{data.totalCount} covers
				</div>
			{/if}
			{#if !(data.isFirst && data.isLast)}
				<div class="buttons">
					<button type="button" disabled={data.isFirst} on:click={handleBack}> Back </button>
					<button type="button" disabled={data.isLast} on:click={handleNext}> Next </button>
				</div>
			{/if}
		</div>
	{/if}
{:catch error}
	{error.message}
{/await}

<style lang="scss">
	.coversGrid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(calc(var(--space-3xl) * 4), 1fr));
		align-items: center;
		gap: var(--space-xl);
		row-gap: var(--space-2xl);
		padding-block: var(--space-2xl);
		@supports (padding: max(0px)) {
			padding-inline-start: max(var(--space-l), env(safe-area-inset-left));
			padding-inline-end: max(var(--space-l), env(safe-area-inset-right));
		}
		@media (max-width: 1100px) {
			grid-template-columns: repeat(auto-fill, minmax(calc(var(--space-3xl) * 3.5), 1fr));
		}
		@media (max-width: 580px) {
			grid-template-columns: repeat(auto-fill, minmax(calc(var(--space-3xl) * 3), 1fr));
		}
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		flex: 1;
		gap: var(--space-l);
		padding-block-end: var(--space-3xl);

		p {
			font-size: var(--step-1);
		}
	}

	.button {
		background: var(--mauve-12);
		color: var(--mauve-1);
		border: none;
		cursor: pointer;
		border-radius: var(--radius-full);
		padding-block: var(--space-s);
		padding-inline: var(--space-xl);
		margin-inline: auto;
		font-size: var(--step-1);
		font-weight: var(--font-weight-bold);

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				background: var(--violet-9);
				color: white;
			}
		}

		&:focus {
			outline: 3px solid var(--violet-a9);
			outline-offset: 3px;
		}
	}

	.pagination {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		align-items: center;
		margin-inline: auto;
		margin-block-end: var(--space-xl);

		.buttons {
			display: flex;
			gap: var(--space-s);
		}

		button {
			background: var(--mauve-12);
			color: var(--mauve-1);
			border: none;
			cursor: pointer;
			border-radius: var(--radius-full);
			padding-block: var(--space-s);
			padding-inline: var(--space-xl);
			font-size: var(--step-1);
			font-weight: var(--font-weight-bold);

			@media (hover: hover) and (pointer: fine) {
				&:not([disabled]):hover {
					background: var(--violet-9);
					color: white;
				}
			}

			&[disabled] {
				opacity: 0.3;
				cursor: default;
			}

			&:focus {
				outline: 3px solid var(--violet-a9);
				outline-offset: 3px;
			}
		}
	}
</style>

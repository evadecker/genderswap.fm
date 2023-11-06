<script lang="ts">
	export let text: string;
	export let count: number = 0;
	export let url: string = '';
</script>

{#if url}
	<a href={url} class="tag">
		{text}
		{#if count}
			<span class="count">{count}</span>
		{/if}
	</a>
{:else}
	<div class="tag">
		{text}
		{#if count}
			<span class="count">{count}</span>
		{/if}
	</div>
{/if}

<style>
	.tag {
		display: inline-flex;
		gap: var(--space-xs);
		align-items: baseline;
		background: var(--mauve-3);
		color: var(--mauve-11);
		padding-block: var(--space-2xs);
		padding-inline: var(--space-m);
		border-radius: var(--radius-full);
		font-size: var(--step-0);
	}

	a.tag:hover {
		background: var(--mauve-4);
	}

	.count {
		color: var(--mauve-10);
		font-size: var(--step--1);
	}
</style>

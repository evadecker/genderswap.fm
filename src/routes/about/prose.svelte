<script>
	import dayjs from 'dayjs';

	export let title;
	export let description;
	export let datePublished;
	export let dateModified;

	const formattedPublishDate = dayjs(datePublished).format('MMMM D, YYYY');
	const formattedModifiedDate = dayjs(dateModified).format('MMMM D, YYYY');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<article itemscope itemtype="https://schema.org/BlogPosting">
	<header class="prose-header">
		<h1 itemprop="name" class="prose-title">{title}</h1>
		<div class="prose-dates">
			<span>Published <time datetime={datePublished.toString()}>{formattedPublishDate}</time></span>
			{#if dateModified}
				<span>
					Updated
					<time datetime={dateModified.toString()}>
						{formattedModifiedDate}
					</time>
				</span>
			{/if}
		</div>
	</header>
	<section itemprop="articleBody" class="prose">
		<slot />
	</section>
</article>

<style lang="scss">
	.prose-header {
		text-align: center;
		padding-inline: var(--space-xl);
		padding-block-start: var(--space-xl);
		padding-block-end: var(--space-3xl);
	}

	.prose-dates {
		font-size: var(--step-1);
		color: var(--mauve-11);
		margin-block-start: var(--space-m);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		column-gap: var(--space-l);
	}

	.prose {
		box-sizing: content-box;
		max-inline-size: 54ch;
		margin-inline: auto;
		padding-inline: var(--space-xl);
		padding-block-end: var(--space-3xl);

		:global(a) {
			text-indent: 0;
			&:hover,
			&:focus {
				color: var(--violet-12);
			}
		}

		:global(p),
		:global(li) {
			:global(a) {
				position: relative;
				text-decoration: underline;
				text-decoration-color: var(--mauve-7);
				text-underline-offset: 0.1em;
				transition: all 0.2s ease-in-out;

				&:hover,
				&:focus {
					text-decoration-color: var(--violet-9);
				}
			}
		}

		:global(h2),
		:global(h3) {
			margin-bottom: var(--space-l);
		}

		:global(h2) {
			font-size: var(--step-3);
			margin-top: var(--space-3xl);

			&:first-child {
				margin-top: 0;
			}
		}

		:global(*) {
			+ :global(p),
			+ :global(ul),
			+ :global(ol),
			+ :global(blockquote) {
				margin-top: var(--space-l);
				margin-bottom: var(--space-l);
			}
		}

		:global(ul),
		:global(ol) {
			padding-left: var(--space-xl);

			:global(ul),
			:global(ol) {
				margin-top: 0;
				margin-bottom: 0;
			}
		}

		:global(blockquote) {
			border-left: 2px solid var(--mauve-7);
			padding-left: 1.3em;
			font-style: italic;
			hanging-punctuation: first;

			:global(cite) {
				display: block;
				font-style: normal;

				&:before {
					content: '—';
					color: var(--mauve-11);
					margin-inline-end: 0.3em;
				}
			}
		}

		:global(img) {
			/* This width is just for Andrea Lawlor's email;
         if other images are added, might need to enable MDX
         and set width per-image */
			width: 585px;
			max-width: 100%;
			border-radius: var(--radius-s);
			margin-inline: auto;
		}
	}
</style>

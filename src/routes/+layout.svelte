<script lang="ts">
	import '$lib/styles/reset.css';
	import '$lib/styles/theme.css';
	import '$lib/styles/base.css';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Header />
<main class="main">
	<slot />
</main>
<Footer />

<style>
	.main {
		flex: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
</style>

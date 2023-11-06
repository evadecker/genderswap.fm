<script lang="ts">
  export let title: string;
  export let description: string = '';
</script>

<header class="header">
  <h1 class="title">{title}</h1>
  {#if description}
    <p class="description">{description}</p>
  {/if}
  <slot />
</header>

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
    gap: var(--space-l);
    text-wrap: balance;
  }

  .description {
    font-size: var(--step-2);
    text-wrap: balance;
  }
</style>

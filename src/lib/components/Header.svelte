<script>
  import Logo from './Logo.svelte';
  import AddIcon from '~icons/ri/add-line';
</script>

<header>
  <div class="container">
    <Logo />
    <nav>
      <a href="/new" class="button">
        <AddIcon />
        <span>Submit a cover</span>
      </a>
    </nav>
  </div>
</header>

<style lang="scss">
  header {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 1000;
    padding-inline-start: var(--space-m);
    padding-inline-end: var(--space-m);
    @supports (padding: max(0px)) {
      padding-inline-start: max(var(--space-m), env(safe-area-inset-left));
      padding-inline-end: max(var(--space-m), env(safe-area-inset-right));
    }
    pointer-events: none;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-s) 0;
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-s);
    pointer-events: auto;
  }

  .button {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2xs);
    background: var(--mauve-12);
    color: var(--mauve-1);
    line-height: 1;
    font-weight: var(--font-weight-bold);
    padding-block: var(--space-xs);
    padding-inline: var(--space-s) var(--space-m);
    border-radius: var(--radius-full);

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
</style>

<script lang="ts">
  export let error: string;
  export let banner: boolean = false;
</script>

<div class="error" class:banner>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
  >
    <path
      d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
    />
  </svg>
  <span class="errorMessage">{error}</span>
</div>

<style lang="scss">
  .error {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--red-9);
    margin-block-start: var(--space-xs);

    &.banner {
      background-color: var(--red-3);
      padding-block: var(--space-s);
      padding-inline: var(--space-m);
      border-radius: var(--radius-s);
    }
  }
</style>

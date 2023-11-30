<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import Steps from '$lib/components/Steps.svelte';
  import Step from '$lib/components/Step.svelte';
  import SongSelect from '$lib/components/SongSelect.svelte';
  import GenderSelect from '$lib/components/GenderSelect.svelte';
  import autosize from 'svelte-autosize';
  import { getMaxCharacterHelpText } from '$lib/helpers';
  import type { PageData } from './$types';
  import { MAX_CONTRIBUTOR_CHARS, MAX_DESCRIPTION_CHARS } from '$lib/constants';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import LoaderIcon from '~icons/ri/loader-4-line';
  import type { FormEventHandler } from 'svelte/elements';
  import NewCoverIcon from '$lib/components/NewCoverIcon.svelte';

  export let data: PageData;

  const { form, errors, enhance, submitting, delayed } = superForm(data.form, {
    dataType: 'json',
    defaultValidator: 'clear',
    scrollToError: 'smooth'
  });

  $form.contributor = browser ? window.localStorage.getItem('contributor') ?? '' : '';

  const handleDescriptionInput: FormEventHandler<HTMLTextAreaElement> = (e) => {
    $form.description = e.currentTarget.value;
    // Replace any newlines with spaces and trim
    $form.description = $form.description.replace(/\r?\n|\r/g, ' ').trimStart();

    $form.description = $form.description;
  };

  const handleContributorInput: FormEventHandler<HTMLInputElement> = (e) => {
    $form.contributor = e.currentTarget.value;
    // Trim spaces
    $form.contributor = $form.contributor.trimStart();
  };

  const handleSubmit = () => {
    // Save name to local storage for reuse
    if (browser) window.localStorage.setItem('contributor', $form.contributor);
  };
</script>

<svelte:head>
  <title>Add a cover</title>
  <meta name="description" content="Upload a fresh gender-swapped cover to the catalogue." />
  <link rel="canonical" href={`https://genderswap.fm${$page.url.pathname}`} />
</svelte:head>

<form class="submitForm" method="POST" use:enhance>
  <h1 class="header">Add a cover</h1>
  <Steps>
    <Step title="Select the original">
      <SongSelect name="original" bind:value={$form.original} errors={$errors.original} />
      <GenderSelect
        name="originalGenders"
        bind:value={$form.originalGenders}
        errors={$errors.originalGenders?._errors}
      />
    </Step>
    <Step title="Select the cover">
      <SongSelect name="cover" bind:value={$form.cover} errors={$errors.cover} />
      <GenderSelect
        name="coverGenders"
        bind:value={$form.coverGenders}
        errors={$errors.coverGenders?._errors}
      />
    </Step>
    <Step title="Add thoughts">
      <label>
        <div class="label">
          Description <span class="optional">optional</span>
        </div>
        <textarea
          on:input={handleDescriptionInput}
          bind:value={$form.description}
          use:autosize
          name="description"
          class="input"
          minRows={2}
          maxRows={4}
          placeholder="What’s different about this cover?"
        />
        <div
          class="helpText"
          class:warning={$form.description && $form.description.length > MAX_DESCRIPTION_CHARS}
        >
          {getMaxCharacterHelpText($form.description ?? '', MAX_DESCRIPTION_CHARS)}
        </div>
      </label>
      <label>
        <div class="label">
          Your first name <span class="optional">optional</span>
        </div>
        <input
          on:input={handleContributorInput}
          bind:value={$form.contributor}
          name="contributor"
          type="text"
          class="input"
          maxlength={MAX_CONTRIBUTOR_CHARS}
          placeholder="Agnetha"
        />
      </label>
      {#if $errors?._errors}
        {#each $errors._errors as error}
          <ErrorMessage {error} banner />
        {/each}
      {/if}
    </Step>
  </Steps>

  <button disabled={$submitting} class="submitButton" type="submit" on:click={handleSubmit}>
    {#if $delayed}
      <div class="spinner">
        <LoaderIcon />
      </div>
    {:else}
      <NewCoverIcon />
    {/if}
    Submit
  </button>
</form>

<!-- Missing toasts error handling -->

<style lang="scss">
  .submitForm {
    inline-size: 100%;
    max-inline-size: 50ch;
    margin-inline: auto;
    padding-inline: var(--space-l);
    padding-block-end: var(--space-2xl);
  }

  .header {
    text-align: center;
    font-size: var(--step-4);
    padding-block: var(--space-m) var(--space-xl);
  }

  .submitButton {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    background: var(--mauve-12);
    color: var(--mauve-1);
    border: none;
    cursor: pointer;
    border-radius: var(--radius-full);
    padding-block: var(--space-s);
    padding-inline: var(--space-l) var(--space-xl);
    margin-inline: auto;
    font-size: var(--step-1);
    font-weight: var(--font-weight-bold);
    font-feature-settings: var(--font-unstable);

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background: var(--green-9);
        color: white;
      }
    }

    &[disabled] {
      opacity: 0.7;
      cursor: default;
    }

    &:focus {
      outline: 3px solid var(--green-a9);
      outline-offset: 3px;
    }

    :global(svg) {
      width: var(--space-xl);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .spinner {
    animation: spin 0.7s linear infinite;
  }

  .label {
    display: block;
    padding-block-end: var(--space-xs);
  }

  .optional {
    font-size: var(--step--1);
    font-style: italic;
  }

  .input {
    border: none;
    display: block;
    background: var(--mauve-3);
    border-radius: var(--radius-m);
    padding-block: var(--space-s);
    padding-inline: var(--space-m);
    width: 100%;
    resize: none;

    &::placeholder {
      color: var(--mauve-8);
    }

    &:focus {
      outline: 3px solid var(--green-a9);
      outline-offset: 3px;
    }
  }

  .helpText {
    padding-block-start: var(--space-xs);
    font-size: var(--step--1);
    font-variant-numeric: tabular-nums;

    &.warning {
      color: var(--red-9);
      font-weight: var(--font-weight-bold);
    }
  }
</style>

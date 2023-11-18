<script lang="ts">
  import SongPreview from '$lib/components/SongPreview.svelte';
  import type { Track } from '@spotify/web-api-ts-sdk';
  import { createCombobox, melt } from '@melt-ui/svelte';
  import ErrorMessage from './ErrorMessage.svelte';

  export let name: string;
  export let value: Track | undefined;
  export let errors: string[] | undefined = undefined;

  let searchResults: Track[] | undefined = undefined;

  const {
    elements: { menu, input, option, label },
    states: { open, inputValue, touchedInput, selected },
    helpers: { isSelected, isHighlighted }
  } = createCombobox<Track>({
    onSelectedChange: ({ next }) => {
      if (next) {
        value = next.value;
      }
      return next;
    }
  });

  $: selected.set(value ? { value } : undefined);

  let debounceTimer: ReturnType<typeof setTimeout>;
  const debounce = (callback: () => void) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, 250);
  };

  const search = async (query: string | undefined) => {
    if (!query || query === '') {
      searchResults = undefined;
      return;
    }

    try {
      const encoded = encodeURIComponent(
        query
          .replace(/\//g, '-') // Replace all forward slashes with dashes
          .replace(/\?/g, '') // Remove question marks
      );
      const response = await fetch(`/api/getSpotifyResults?q=${encoded}`, {
        method: 'GET'
      });
      const data = await response.json();
      searchResults = data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const handleClearSelection = () => {
    inputValue.set('');
    value = undefined;
  };

  $: {
    if ($touchedInput) {
      debounce(() => {
        search($inputValue);
      });
    }
  }
</script>

<fieldset {name}>
  {#if value}
    <SongPreview song={value} onClearSelection={handleClearSelection} />
  {:else}
    <div class="searchWrapper" class:hidden={!!value}>
      <label use:melt={$label} aria-label="Search" class="inputWrapper">
        <svg
          class="searchIcon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"
          />
        </svg>
        <input
          use:melt={$input}
          class="searchInput"
          type="search"
          placeholder={name === 'original' ? 'abba angeleyes' : 'the czars angeleyes'}
          aria-invalid={errors ? 'true' : undefined}
        />
      </label>
      {#if $open && searchResults}
        <ul use:melt={$menu} class="searchResults">
          {#each searchResults as track}
            <li
              use:melt={$option({
                value: track,
                label: track.name,
                disabled: false
              })}
              class="result"
              class:highlighted={$isHighlighted(track)}
              class:selected={$isSelected(track)}
            >
              <img class="resultAlbum" src={track.album.images[0].url} alt={track.name} />
              <div class="resultLabel">
                <div class="resultName">{track.name}</div>
                <div class="resultLabelDetails">
                  <div class="resultArtist">
                    {track.artists.map((artist) => artist.name).join(', ')}{' '}
                    {' · '}
                    <span class="resultYear">
                      {track.album.release_date.slice(0, 4)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          {:else}
            <li class="empty">No results found</li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
  {#if errors}
    {#each errors as error}
      <ErrorMessage {error} />
    {/each}
  {/if}
</fieldset>

<style lang="scss">
  fieldset {
    all: unset;
  }

  .searchWrapper {
    position: relative;
    &.hidden {
      display: none;
    }
  }

  .inputWrapper {
    position: relative;
  }

  .searchIcon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: var(--space-m);
    fill: currentColor;
  }

  .searchInput {
    border: none;
    width: 100%;
    background: var(--mauve-3);
    border-radius: var(--radius-full);
    padding-block: var(--space-s);
    padding-inline: var(--space-m);
    padding-left: calc(24px + var(--space-m) + var(--space-s));

    &::placeholder {
      color: var(--mauve-8);
    }

    &:focus {
      outline: 3px solid var(--violet-a9);
      outline-offset: 3px;
    }
  }

  .searchResults {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    overflow-y: scroll;
    background-color: var(--mauve-3);
    border: 1px solid var(--mauve-6);
    border-radius: var(--radius-m);
    box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35),
      0px 10px 20px -15px rgba(22, 23, 24, 0.2);
    width: var(--radix-select-trigger-width);
    padding: var(--space-xs);
    z-index: 10;
    max-height: 40vh;
  }

  .result {
    color: var(--mauve-12);
    border-radius: var(--radius-s);
    padding: var(--space-xs);
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--space-s);
    user-select: none;
    cursor: pointer;

    &.highlighted {
      outline: none;
      background-color: var(--mauve-5);
    }
  }

  .empty {
    color: var(--mauve-11);
    padding-block: var(--space-l);
    text-align: center;
  }

  .resultLabel {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: var(--space-s);
  }

  .resultAlbum {
    width: var(--space-3xl);
    height: var(--space-3xl);
    background: var(--mauve-3);
    border-radius: var(--radius-xs);
  }

  .resultName {
    font-weight: var(--font-weight-bold);
    margin-block-end: calc(var(--space-xs) * -1);
  }

  .resultName,
  .resultArtist {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .resultLabelDetails {
    font-size: var(--step--1);
  }
</style>

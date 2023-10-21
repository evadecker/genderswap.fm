import { type Track } from "@spotify/web-api-ts-sdk";
import styles from "./songSelect.module.scss";
import classNames from "classnames";

import { URLify } from "../../helpers/helpers";
import { useState } from "react";
import { useCombobox } from "downshift";

export type Props = {
  type: "original" | "cover";
  song: Track | null | undefined;
  onChange: (song: Track | null | undefined) => void;
};

export const SongSelect = ({ type, song, onChange }: Props) => {
  const [searchResults, setSearchResults] = useState<Track[] | undefined>();

  const search = async (query?: string) => {
    if (!query || query === "") {
      setSearchResults(undefined);
      return;
    }

    try {
      const urlifiedQuery = URLify(query);
      const response = await fetch(`/api/getSpotifyResults/${urlifiedQuery}`, {
        method: "GET",
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const {
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    isOpen,
    highlightedIndex,
    selectedItem,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      search(inputValue);
    },
    defaultHighlightedIndex: 0,
    items: searchResults || [],
    itemToString: (item) => (item ? item.name : ""),
    onSelectedItemChange: ({ selectedItem }) => {
      onChange(selectedItem);
    },
  });

  return (
    <>
      {song && (
        <div className={styles.selectedSong}>
          <img
            className={styles.selectedAlbum}
            src={song.album.images[0].url}
            alt={song.name}
          />
          <div className={styles.selectedLabel}>
            <div className={styles.selectedName}>{song.name}</div>
            <div>{song.artists.map((artist) => artist.name).join(", ")}</div>
            <div className={styles.selectedAlbumNameAndYear}>
              <em>{song.album.name}</em> &middot;{" "}
              {song.album.release_date.slice(0, 4)}
            </div>
          </div>
          <button
            className={styles.clearSelection}
            onClick={() => onChange(undefined)}
            aria-label="Remove selection"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"></path>
            </svg>
          </button>
        </div>
      )}

      <div
        className={classNames(styles.searchWrapper, {
          [styles.hidden]: song,
        })}
      >
        <label {...getLabelProps()} hidden>
          Search
        </label>
        <div className={styles.inputWrapper}>
          <svg
            className={styles.searchIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
          </svg>
          <input
            className={styles.searchInput}
            placeholder={
              type === "original" ? "abba angeleyes" : "the czars angel eyes"
            }
            {...getInputProps()}
          />
        </div>
        <ul
          className={classNames(styles.searchResults, {
            [styles.hidden]: !(isOpen && !!searchResults),
          })}
          {...getMenuProps()}
        >
          {searchResults?.map((track, index) => (
            <li
              key={track.id}
              className={classNames(styles.result, {
                [styles.selected]: selectedItem === track,
                [styles.highlighted]: highlightedIndex === index,
              })}
              {...getItemProps({ item: track, index })}
            >
              <img
                className={styles.resultAlbum}
                src={track.album.images[0].url}
                alt={track.name}
              />
              <div className={styles.resultLabel}>
                <div className={styles.resultName}>{track.name}</div>
                <div className={styles.resultArtist}>
                  {track.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

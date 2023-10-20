import { type Track } from "@spotify/web-api-ts-sdk";
import * as Select from "@radix-ui/react-select";
import styles from "./search.module.scss";

import { URLify } from "../../helpers/helpers";
import { useState, type ChangeEvent } from "react";
import { SearchResults } from "./SearchResults";

export const SpotifySearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Track[] | undefined>();

  const search = async (q: string) => {
    if (q === "") {
      setSearchResults(undefined);
      return;
    }

    try {
      const response = await fetch("/api/searchSpotify", {
        method: "POST",
        body: URLify(q),
      });
      const data = await response.json();
      setSearchResults(data);
      setIsOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
  };

  return (
    <Select.Root open={isOpen}>
      <Select.Trigger asChild>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search for the original"
          onChange={handleChange}
        />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className={styles.content}
          position="popper"
          side="bottom"
          sideOffset={5}
          onEscapeKeyDown={() => setIsOpen(false)}
          onPointerDownOutside={() => setIsOpen(false)}
        >
          <Select.ScrollUpButton className={styles.scrollButton}>
            ⬆️
          </Select.ScrollUpButton>
          <SearchResults tracks={searchResults} />
          <Select.ScrollDownButton className={styles.scrollButton}>
            ⬇️
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

import { type Track } from "@spotify/web-api-ts-sdk";

import { useState, type ChangeEvent } from "react";
import { SearchResults } from "./SearchResults";

export const SpotifySearch = () => {
  const [searchResults, setSearchResults] = useState<Track[] | undefined>();

  async function search(q: string) {
    if (q === "") {
      setSearchResults(undefined);
      return;
    }

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        body: q,
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
  };

  return (
    <div>
      <input
        className="search"
        type="text"
        placeholder="Search for the original"
        onChange={handleChange}
      />
      <SearchResults tracks={searchResults} />
    </div>
  );
};

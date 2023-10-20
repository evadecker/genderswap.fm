import type { Track } from "@spotify/web-api-ts-sdk";

type SearchResultsProps = {
  tracks?: Track[];
};

export const SearchResults = ({ tracks }: SearchResultsProps) => {
  if (!tracks) return null;

  return (
    <ul>
      {tracks.map((track) => (
        <li key={track.id}>
          {track.name} by {track.artists[0].name}
        </li>
      ))}
    </ul>
  );
};

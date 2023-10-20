import type { Track } from "@spotify/web-api-ts-sdk";
import * as Select from "@radix-ui/react-select";
import styles from "./search.module.scss";

type SearchResultsProps = {
  tracks?: Track[];
};

export const SearchResults = ({ tracks }: SearchResultsProps) => {
  if (!tracks) return null;

  return (
    <Select.Viewport className={styles.viewport}>
      {tracks.map((track) => (
        <Select.Item key={track.id} value={track.id} className={styles.result}>
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
        </Select.Item>
      ))}
    </Select.Viewport>
  );
};

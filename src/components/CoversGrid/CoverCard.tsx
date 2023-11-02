import { smartquotes } from "../../helpers/helpers.ts";
import styles from "./coversGrid.module.scss";

type Props = {
  originalSongId: string;
  originalSongName: string;
  originalSongArtist: string;
  originalAlbumImg: string;
  originalAlbumName: string;
  coverSongId: string;
  coverSongArtist: string;
  coverAlbumImg: string;
  coverAlbumName: string;
  slug: string;
};

export const CoverCard = ({
  originalSongId,
  originalSongName,
  originalSongArtist,
  originalAlbumImg,
  originalAlbumName,
  coverSongId,
  coverSongArtist,
  coverAlbumImg,
  coverAlbumName,
  slug,
}: Props) => {
  const title = smartquotes(originalSongName);

  return (
    <div className={styles.coverCard}>
      <div className={styles.albums}>
        <div
          className={styles.album}
          // transition:name={`album-${originalSongId}`}
        >
          {originalAlbumImg && (
            <img
              src={originalAlbumImg}
              alt={`${originalAlbumName} album art`}
            />
          )}
        </div>
        <div
          className={styles.album}
          // transition:name={`album-${coverSongId}`}
        >
          {coverAlbumImg && (
            <img src={coverAlbumImg} alt={`${coverAlbumName} album art`} />
          )}
        </div>
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.artist}>
          <strong>{coverSongArtist}</strong> covering{" "}
          <strong>{originalSongArtist}</strong>
        </div>
        <a
          className={styles.link}
          href={`/cover/${slug}`}
          aria-label={`More about ${originalSongName}`}
        ></a>
      </div>
    </div>
  );
};

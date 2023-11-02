import { smartquotes } from "../../helpers/helpers.ts";
import styles from "./coversGrid.module.scss";

type Props = {
  originalSongName: string;
  originalSongArtist: string;
  originalAlbumImg: string;
  originalAlbumName: string;
  coverSongArtist: string;
  coverAlbumImg: string;
  coverAlbumName: string;
  slug: string;
};

export const CoverCard = ({
  originalSongName,
  originalSongArtist,
  originalAlbumImg,
  originalAlbumName,
  coverSongArtist,
  coverAlbumImg,
  coverAlbumName,
  slug,
}: Props) => {
  const title = smartquotes(originalSongName);

  return (
    <div className={styles.coverCard}>
      <div className={styles.albums}>
        <div className={styles.album}>
          {originalAlbumImg && (
            <img
              src={originalAlbumImg}
              alt={`${originalAlbumName} album art`}
            />
          )}
        </div>
        <div className={styles.album}>
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

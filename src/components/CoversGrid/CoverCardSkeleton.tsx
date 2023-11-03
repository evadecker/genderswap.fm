import classnames from "classnames";
import styles from "./coversGrid.module.scss";

export const CoverCardSkeleton = () => {
  const getRandomWidth = () => {
    const maxWidth = 90;
    const minWidth = 40;
    return Math.random() * (maxWidth - minWidth) + minWidth + "%";
  };

  return (
    <div
      className={classnames(styles.coverCard, styles.placeholder)}
      aria-hidden
    >
      <div className={styles.albums}>
        <div className={styles.album}></div>
        <div className={styles.album}></div>
      </div>
      <div className={styles.content}>
        <h2 className={styles.title} style={{ width: getRandomWidth() }} />
        <div className={styles.artist} style={{ width: getRandomWidth() }} />
      </div>
    </div>
  );
};

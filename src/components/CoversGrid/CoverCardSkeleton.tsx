import classnames from "classnames";
import styles from "./coversGrid.module.scss";

export const CoverCardSkeleton = () => (
  <div className={classnames(styles.coverCard, styles.placeholder)} aria-hidden>
    <div className={styles.albums}>
      <div className={styles.album}></div>
      <div className={styles.album}></div>
    </div>
    <div className={styles.content}>
      <h2 className={styles.title} />
      <div className={styles.artist} />
    </div>
  </div>
);

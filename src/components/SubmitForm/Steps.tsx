import type { PropsWithChildren } from "react";
import styles from "./steps.module.scss";

type Props = {
  title: string;
};

export const Step = ({ title, children }: PropsWithChildren<Props>) => {
  return (
    <li className={styles.step}>
      <h2 className={styles.stepTitle}>{title}</h2>
      <div className={styles.stepContent}>{children}</div>
    </li>
  );
};

export const Steps = ({ children }: PropsWithChildren) => (
  <ol className={styles.steps}>{children}</ol>
);

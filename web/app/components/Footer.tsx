import styles from "./styles/module/footer.module.scss";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <span>&copy;{new Date().getFullYear()}. All Rights Reserved.</span>
          <span>
          Site by <Link href="https://studiosmall.com" target="_blank" rel="noopener noreferrer">StudioSmall.</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

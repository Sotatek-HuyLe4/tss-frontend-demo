import Image from "next/image";
import Link from "next/link";

import styles from "./index.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brandSection}>
        <Image
          src="/images/logo.png"
          alt="TSS logo"
          width={44}
          height={44}
          className={styles.logo}
          priority
        />
        <div className={styles.brandText}>
          <p className={styles.title}>TSS Service</p>
          <p className={styles.description}>
            Secure, distributed signing for the TSS project
          </p>
        </div>
      </Link>

      <div className={styles.statusBadge}>
        <span className={styles.statusDot} />
        <span className={styles.statusText}>OPERATIONAL</span>
      </div>
    </header>
  );
};

export default Header;

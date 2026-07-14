"use client";

import { useState } from "react";
import Image from "next/image";

import styles from "./index.module.scss";

type Vault = {
  id: string;
  name: string;
  address: string;
  balance: string;
  createdAt: Date;
  updatedAt: Date;
};

const ListVault = () => {
  const [vaults] = useState<Vault[]>([]);

  return (
    <section className={styles.card}>
      <div className={styles.cardGlow} />

      <header className={styles.header}>
        <h2 className={styles.title}>Your Vaults</h2>
        <p className={styles.description}>
          Threshold-signed vaults you've created. Each requires 2-of-3 signers
          to authorize a transaction.
        </p>
      </header>

      <div className={styles.divider} />

      <div className={styles.body}>
        {vaults.length > 0 ? (
          <div className={styles.vaultList}>
            {vaults.map((vault) => (
              <div key={vault.id} className={styles.vaultItem}>
                {vault.name}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrap}>
              <Image
                src="/icons/hexagon-dashed-plus-icon.svg"
                alt=""
                width={72}
                height={72}
                className={styles.emptyIcon}
                aria-hidden
              />
            </div>
            <p className={styles.emptyTitle}>No vaults yet</p>
            <p className={styles.emptySubtitle}>
              Create your first threshold vault to get started.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ListVault;

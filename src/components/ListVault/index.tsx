"use client";

import { useState } from "react";
import Image from "next/image";

import styles from "./index.module.scss";
import VaultItem from "../VaultItem";

type Vault = {
  id: string;
  name: string;
  address: string;
  balance: string;
  createdAt: Date;
  updatedAt: Date;
};

const MOCK_VAULTS: Vault[] = [
  {
    id: "1",
    name: "Treasury Multisig",
    address: "0x71C7123abc456def7890123456976F",
    balance: "2.4501 ETH",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Cold Storage",
    address: "0xAB3d9876543210fedcba987654392c1A",
    balance: "0.8750 ETH",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Operations Fund",
    address: "0x4Ee81234567890abcdef123456F21b0",
    balance: "1.1200 ETH",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const ListVault = () => {
  const [vaults] = useState<Vault[]>(MOCK_VAULTS);

  return (
    <section className={styles.card}>
      <div className={styles.cardGlow} />

      <header className={styles.header}>
        <h2 className={styles.title}>Your Vaults</h2>
        <p className={styles.description}>
          Threshold-signed vaults you control. Each requires 2-of-3 signers to
          authorize a transaction.
        </p>
      </header>

      <div className={styles.divider} />

      <div className={styles.body}>
        {vaults.length > 0 ? (
          <div className={styles.vaultList}>
            {vaults.map((vault) => (
              <VaultItem key={vault.id} {...vault} />
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

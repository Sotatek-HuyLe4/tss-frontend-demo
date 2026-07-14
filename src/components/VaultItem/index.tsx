"use client";

import Image from "next/image";
import { Button } from "antd";
import { toast } from "react-toastify";
import { useState } from "react";

import styles from "./index.module.scss";
import { faucet } from "@/apis/faucet";

export interface IVaultItem {
  id: string;
  name: string;
  address: string;
  balance: string;
}

const truncateAddress = (address: string) => {
  if (address.length <= 13) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-5)}`;
};

const VaultItem = ({ name, address, balance }: IVaultItem) => {
  const [isFaucetLoading, setIsFaucetLoading] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied");
    } catch {
      toast.error("Failed to copy address");
    }
  };

  const handleFaucet = async () => {
    setIsFaucetLoading(true);

    try {
      // try to faucet the address
      await faucet({ address });
      await new Promise((resolve) => setTimeout(resolve, 3_000));

      toast.success("Faucet successful");
    } catch (error) {
      console.error(error);

      toast.error("Failed to faucet");
    }

    setIsFaucetLoading(false);
  };

  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <Image
          src="/icons/hexagon-vault-icon.svg"
          alt=""
          width={40}
          height={40}
          className={styles.icon}
          aria-hidden
        />
        <div className={styles.meta}>
          <p className={styles.name}>{name}</p>
          <button
            type="button"
            className={styles.addressRow}
            onClick={handleCopyAddress}
            aria-label="Copy address"
          >
            <Image
              src="/icons/copy-icon.svg"
              alt=""
              width={16}
              height={16}
              className={styles.copyIcon}
              aria-hidden
            />
            <span className={styles.address}>{truncateAddress(address)}</span>
          </button>
        </div>
      </div>

      <div className={styles.right}>
        <p className={styles.balance}>{balance} ETH</p>
        <div className={styles.actions}>
          <Button
            className={styles.faucetBtn}
            onClick={handleFaucet}
            loading={isFaucetLoading}
            disabled={isFaucetLoading}
          >
            Faucet
          </Button>
          <Button className={styles.sendBtn}>Send ETH</Button>
        </div>
      </div>
    </div>
  );
};

export default VaultItem;

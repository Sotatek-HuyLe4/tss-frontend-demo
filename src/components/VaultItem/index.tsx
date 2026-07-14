import Image from "next/image";
import { Button } from "antd";

import styles from "./index.module.scss";

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
          <p className={styles.address}>{truncateAddress(address)}</p>
        </div>
      </div>

      <div className={styles.right}>
        <p className={styles.balance}>{balance}</p>
        <div className={styles.actions}>
          <Button className={styles.faucetBtn}>Faucet</Button>
          <Button className={styles.sendBtn}>Send ETH</Button>
        </div>
      </div>
    </div>
  );
};

export default VaultItem;

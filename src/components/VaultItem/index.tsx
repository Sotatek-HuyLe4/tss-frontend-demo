"use client";

import Image from "next/image";
import { Button, Modal, Form, Input } from "antd";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./index.module.scss";
import { faucet } from "@/apis/faucet";
import { createChannel, signTx } from "@/apis/tss";

export interface IVaultItem {
  id: string;
  name: string;
  address: string;
  balance: string;
}

type FieldType = {
  recipient: string;
  amount: string;
};

const truncateAddress = (address: string) => {
  if (address.length <= 13) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-5)}`;
};

const formatBalance = (balance: string) => {
  return Number(balance).toFixed(4);
};

const VaultItem = ({ name, address, balance }: IVaultItem) => {
  const [isFaucetLoading, setIsFaucetLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendForm] = Form.useForm<FieldType>();
  const router = useRouter();

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied");
    } catch {
      toast.error("Failed to copy address");
    }
  };

  const handleMaxAmount = () => {
    sendForm.setFieldsValue({ amount: (Number(balance) - 0.00063).toString() });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    sendForm.resetFields();
  };

  const handleSendEth = async (values: FieldType) => {
    setIsSending(true);
    const { recipient, amount } = values;

    try {
      // get the channel id
      const { channelId } = await createChannel();

      // sign the tx
      await signTx({ vault: name, channelId, toAddress: recipient, amount });

      // sleep for 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5_000));

      toast.success("ETH sent successfully");

      // refresh the page
      router.refresh();
    } catch (error) {
      console.log(error);

      toast.error("Failed to send ETH");
    }

    setIsSending(false);
    handleCloseModal();
  };

  const handleFaucet = async () => {
    setIsFaucetLoading(true);

    try {
      // try to faucet the address
      await faucet({ address });
      await new Promise((resolve) => setTimeout(resolve, 5_000));

      toast.success("Faucet successful");
      router.refresh();
    } catch (error) {
      console.log(error);

      toast.error("Failed to faucet");
    }

    setIsFaucetLoading(false);
  };

  return (
    <>
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
          <p className={styles.balance}>{formatBalance(balance)} ETH</p>
          <div className={styles.actions}>
            <Button
              className={styles.faucetBtn}
              onClick={handleFaucet}
              loading={isFaucetLoading}
              disabled={isFaucetLoading}
            >
              Faucet
            </Button>
            <Button
              className={styles.sendBtn}
              onClick={() => setIsModalOpen(true)}
              disabled={isModalOpen}
              loading={isModalOpen}
            >
              Send ETH
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title={null}
        closable={{ "aria-label": "Close" }}
        open={isModalOpen}
        footer={null}
        centered
        width={520}
        onCancel={handleCloseModal}
        className={styles.sendModal}
        classNames={{ mask: styles.sendModalMask, body: styles.sendModalBody }}
      >
        <div className={styles.sendCard}>
          <div className={styles.sendGlow} />

          <div className={styles.sendHeader}>
            <Image
              src="/icons/hexagon-send-icon.svg"
              alt=""
              width={44}
              height={44}
              className={styles.sendIcon}
              aria-hidden
            />
            <h3 className={styles.sendTitle}>Send ETH</h3>
            <p className={styles.sendDescription}>
              Broadcast a transaction from this vault. Sending requires 2-of-3
              threshold signatures before it&apos;s confirmed.
            </p>

            <div className={styles.vaultPill}>
              <span className={styles.vaultPillLeft}>
                <Image
                  src="/icons/hexagon-vault-icon.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.vaultPillIcon}
                  aria-hidden
                />
                <span className={styles.vaultPillName}>{name}</span>
              </span>
              <span className={styles.vaultPillBalance}>
                {formatBalance(balance)} ETH available
              </span>
            </div>
          </div>

          <div className={styles.sendDivider} />

          <Form<FieldType>
            name={`sendEth-${address}`}
            layout="vertical"
            form={sendForm}
            onFinish={handleSendEth}
            autoComplete="off"
            requiredMark={false}
            className={styles.sendForm}
          >
            <Form.Item<FieldType>
              label={
                <span className={styles.fieldLabel}>RECIPIENT ADDRESS</span>
              }
              name="recipient"
              rules={[
                { required: true, message: "Please enter a recipient address" },
              ]}
              className={styles.sendFormItem}
            >
              <Input
                prefix={
                  <Image
                    src="/icons/hexagon-prefix-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    aria-hidden
                  />
                }
                placeholder="0x..."
                className={styles.sendInput}
                classNames={{ input: styles.sendInputField }}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label={<span className={styles.fieldLabel}>AMOUNT</span>}
              name="amount"
              rules={[
                { required: true, message: "Please enter an amount" },
                {
                  validator: (_, value) => {
                    if (
                      Number(value) > Number(balance) - 0.00063 ||
                      Number(value) <= 0
                    ) {
                      return Promise.reject(new Error("Insufficient balance"));
                    }

                    return Promise.resolve();
                  },
                },
              ]}
              className={styles.sendFormItem}
            >
              <Input
                placeholder="0.00"
                suffix={
                  <span className={styles.amountSuffix}>
                    <span className={styles.ethLabel}>ETH</span>
                    <button
                      type="button"
                      className={styles.maxBtn}
                      onClick={handleMaxAmount}
                    >
                      MAX
                    </button>
                  </span>
                }
                className={styles.sendInput}
                classNames={{ input: styles.sendInputField }}
              />
            </Form.Item>

            <p className={styles.availableText}>
              Available: {formatBalance(balance)} ETH
            </p>

            <Form.Item className={styles.sendSubmitItem}>
              <Button
                htmlType="submit"
                className={styles.sendSubmitBtn}
                loading={isSending}
                disabled={isSending}
              >
                Send ETH →
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default VaultItem;

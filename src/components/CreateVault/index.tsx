"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Form, Input } from "antd";

import styles from "./index.module.scss";
import { createChannel, generateKeyShare, initVault } from "@/apis/tss";

type FieldType = {
  vaultName: string;
};

const CreateVault = () => {
  const [form] = Form.useForm<FieldType>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (value: FieldType) => {
    setLoading(true);
    const { vaultName } = value;
    const vault = vaultName.toLowerCase().trim();

    try {
      // init vault
      await initVault({ vault });

      // create channel
      const { channelId } = await createChannel();

      // generate key share
      await generateKeyShare({ vault, channelId });
    } catch (error) {
      console.error(error);
    }

    form.resetFields();
    setLoading(false);
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardGlow} />

      <header className={styles.header}>
        <div className={styles.iconWrapper}>
          <Image
            src="/icons/hexagon-plus-icon.svg"
            alt="Hexagon Plus Icon"
            width={40}
            height={40}
            className={styles.headerIcon}
            aria-hidden
          />
        </div>
        <h2 className={styles.title}>Create Vault</h2>
        <p className={styles.description}>
          Spin up a new threshold-signed vault for your assets. Your key is
          split across signing parties — no single party ever holds the full
          secret.
        </p>
      </header>

      <div className={styles.divider} />

      <Form<FieldType>
        name="createVault"
        layout="vertical"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        className={styles.form}
        requiredMark={false}
      >
        <Form.Item
          label={<span className={styles.fieldLabel}>VAULT NAME</span>}
          name="vaultName"
          rules={[
            { required: true, message: "Please enter a vault name" },
            { max: 20, message: "Vault name must be less than 20 characters" },
          ]}
          className={styles.formItem}
        >
          <Input
            prefix={
              <Image
                src="/icons/hexagon-prefix-icon.svg"
                alt=""
                width={16}
                height={16}
                className={styles.inputIcon}
                aria-hidden
              />
            }
            placeholder="e.g. Alice..."
            className={styles.input}
            classNames={{ input: styles.inputField }}
            disabled={loading}
          />
        </Form.Item>

        <p className={styles.helperText}>
          Default threshold 2-of-3 — add signers after creation.
        </p>

        <Form.Item className={styles.submitItem}>
          <Button
            htmlType="submit"
            className={styles.submitButton}
            loading={loading}
          >
            Create Vault →
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default CreateVault;

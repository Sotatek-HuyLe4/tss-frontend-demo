"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, Form, Input, Modal } from "antd";

import styles from "./index.module.scss";
import { createChannel, generateKeyShare, initVault } from "@/apis/tss";

type FieldType = {
  vaultName: string;
};

type PartyStatus = "committed" | "generating" | "pending";
type Party = {
  id: string;
  label: string;
  status: PartyStatus;
};

const PARTIES: Party[] = [
  { id: "a", label: "Party A", status: "committed" },
  { id: "b", label: "Party B", status: "committed" },
  { id: "c", label: "Party C", status: "generating" },
];

const CreateVault = () => {
  const [form] = Form.useForm<FieldType>();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);

  const clearProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const startSmoothProgress = () => {
    clearProgressTimer();
    progressRef.current = 0;
    setProgress(0);

    progressTimerRef.current = setInterval(() => {
      // Ease toward 92% while work is still running (never finishes early)
      const current = progressRef.current;
      const remaining = 92 - current;
      const step = Math.max(0.25, remaining * 0.035);
      const next = Math.min(92, current + step);

      progressRef.current = next;
      setProgress(Number(next.toFixed(2)));
    }, 120);
  };

  const finishProgress = async () => {
    clearProgressTimer();

    // Gently ramp from current value to 100%
    await new Promise<void>((resolve) => {
      const finishTimer = setInterval(() => {
        const current = progressRef.current;
        const next = Math.min(100, current + Math.max(1.2, (100 - current) * 0.18));

        progressRef.current = next;
        setProgress(Number(next.toFixed(2)));

        if (next >= 100) {
          clearInterval(finishTimer);
          resolve();
        }
      }, 40);
    });

    await new Promise((resolve) => setTimeout(resolve, 350));
  };

  useEffect(() => {
    return () => clearProgressTimer();
  }, []);

  const onFinish = async (value: FieldType) => {
    setLoading(true);
    startSmoothProgress();

    const { vaultName } = value;
    const vault = vaultName.toLowerCase().trim();

    try {
      await initVault({ vault });
      const { channelId } = await createChannel();
      await generateKeyShare({ vault, channelId });
      await finishProgress();
    } catch (error) {
      console.error(error);
      clearProgressTimer();
    } finally {
      form.resetFields();
      setProgress(0);
      progressRef.current = 0;
      setLoading(false);
    }
  };

  return (
    <>
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
              {
                max: 20,
                message: "Vault name must be less than 20 characters",
              },
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

      <Modal
        open={loading}
        title={null}
        closable={false}
        footer={null}
        centered
        width={480}
        className={styles.progressModal}
        classNames={{
          mask: styles.progressModalMask,
          container: styles.progressModalContainer,
          body: styles.progressModalBody,
          header: styles.progressModalHeader,
        }}
      >
        <div className={styles.progressCard}>
          <div className={styles.progressGlow} />

          <h3 className={styles.progressTitle}>Creating Secret Key</h3>
          <p className={styles.progressDescription}>
            Distributing key shares across 3 parties using threshold key
            generation. This may take a moment.
          </p>

          <div className={styles.partyDiagram}>
            <div className={styles.partyRow}>
              {PARTIES.map((party) => (
                <div key={party.id} className={styles.partyItem}>
                  <div
                    className={`${styles.partyNode} ${
                      party.status === "committed"
                        ? styles.partyNodeDone
                        : styles.partyNodeActive
                    }`}
                  >
                    {party.status === "committed" ? (
                      <span className={styles.checkIcon}>✓</span>
                    ) : (
                      <span className={styles.activeDot} />
                    )}
                  </div>
                  <p className={styles.partyLabel}>{party.label}</p>
                  <p
                    className={`${styles.partyStatus} ${
                      party.status === "generating"
                        ? styles.partyStatusActive
                        : ""
                    }`}
                  >
                    {party.status === "committed"
                      ? "Committed"
                      : "Generating..."}
                  </p>
                </div>
              ))}
            </div>

            <svg
              className={styles.connectorSvg}
              viewBox="0 0 480 170"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden
            >
              <path
                d="M80 12 L240 155"
                stroke="#5eead4"
                strokeWidth="1.8"
                strokeOpacity="0.9"
              />
              <path
                d="M240 12 L240 155"
                stroke="#5eead4"
                strokeWidth="1.8"
                strokeOpacity="0.9"
              />
              <path
                d="M400 12 L240 155"
                stroke="#5eead4"
                strokeWidth="1.8"
                strokeOpacity="0.75"
                strokeDasharray="4 7"
              />
            </svg>

            <div className={styles.hubSection}>
              <div className={styles.hubWrap}>
                <Image
                  src="/icons/hexagon-hub-icon.svg"
                  alt=""
                  width={100}
                  height={100}
                  className={styles.hubIcon}
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <p className={styles.roundText}>ROUND 2 OF 3</p>

          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateVault;

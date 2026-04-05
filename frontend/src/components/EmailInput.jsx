import React, { useState } from 'react';
import styles from './EmailInput.module.css';

const SAMPLES = [
  {
    label: '🎰 Lottery Scam',
    sender: 'winner@lotteryscam.net',
    text: 'Congratulations! You have won a prize of $1,000,000 in our international lottery! You are the lucky winner! Click here now to claim your reward and verify your account. This is a limited time offer — act now! Free money awaits you!',
  },
  {
    label: '💊 Pharma Spam',
    sender: 'deals@cheapmeds.biz',
    text: 'Buy cheap Viagra online! Discount pills available now. Click here for the best deals on pharmacy products. Free shipping! Guaranteed results or your money back. Limited time offer!',
  },
  {
    label: '🏦 Phishing',
    sender: 'security@fake-bank.org',
    text: 'URGENT: Your bank account has been compromised. Please verify your password and update your account information immediately. Click the link below to secure your banking credentials. Failure to update may result in account suspension.',
  },
  {
    label: '📅 Legit Meeting',
    sender: 'boss@company.com',
    text: 'Hi, please check your schedule for the team meeting next Thursday at 2 PM. I have attached the agenda document. Let me know if you have any questions. Thanks!',
  },
  {
    label: '📄 Legit Invoice',
    sender: 'billing@stripe.com',
    text: 'Your invoice for this month has been attached. Please review the document and confirm the payment details. Contact our support team if you have any questions about the billing.',
  },
  {
    label: '🔗 Many Links',
    sender: '',
    text: 'Visit http://spam1.com and http://spam2.net and http://spam3.org for amazing deals. Also check http://spam4.biz for free money. Click now!',
  },
];

export default function EmailInput({
  emailText, sender,
  onEmailChange, onSenderChange,
  onAnalyze, onReset, onSampleLoad,
  loading,
}) {
  const [activeSample, setActiveSample] = useState(null);
  const charCount = emailText.length;

  const handleSample = (sample, idx) => {
    setActiveSample(idx);
    onSampleLoad(sample.text, sample.sender);
  };

  return (
    <div className={styles.card}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <span className={styles.titleIcon}>📧</span>
          <span>Email Analyzer</span>
        </div>
        <span className={styles.badge}>Forward Chaining Agent</span>
      </div>

      {/* Sample emails */}
      <div className={styles.section}>
        <label className={styles.label}>Quick Samples</label>
        <div className={styles.samples}>
          {SAMPLES.map((s, idx) => (
            <button
              key={idx}
              id={`sample-btn-${idx}`}
              className={`${styles.sampleBtn} ${activeSample === idx ? styles.sampleActive : ''}`}
              onClick={() => handleSample(s, idx)}
              title={s.text.slice(0, 60) + '...'}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sender field */}
      <div className={styles.section}>
        <label className={styles.label} htmlFor="sender-input">
          Sender Email <span className={styles.optional}>(optional — for trusted sender check)</span>
        </label>
        <input
          id="sender-input"
          type="email"
          className={styles.senderInput}
          placeholder="sender@example.com"
          value={sender}
          onChange={(e) => onSenderChange(e.target.value)}
          disabled={loading}
        />
        <p className={styles.hint}>
          Trusted senders: boss@company.com, hr@company.com, support@google.com, billing@stripe.com...
        </p>
      </div>

      {/* Email body textarea */}
      <div className={styles.section}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="email-textarea">Email Body</label>
          <span className={styles.charCount}>{charCount} chars</span>
        </div>
        <textarea
          id="email-textarea"
          className={styles.textarea}
          placeholder="Paste or type the email text here..."
          value={emailText}
          onChange={(e) => { onEmailChange(e.target.value); setActiveSample(null); }}
          disabled={loading}
          rows={10}
          spellCheck={false}
        />
      </div>

      {/* Action buttons */}
      <div className={styles.actions}>
        <button
          id="analyze-btn"
          className={styles.analyzeBtn}
          onClick={onAnalyze}
          disabled={loading || !emailText.trim()}
        >
          {loading ? (
            <>
              <span className={styles.spinner} />
              Analyzing...
            </>
          ) : (
            <>
              <span>🔍</span> Classify Email
            </>
          )}
        </button>
        <button
          id="reset-btn"
          className={styles.resetBtn}
          onClick={() => { onReset(); setActiveSample(null); }}
          disabled={loading}
        >
          <span>↺</span> Reset
        </button>
      </div>
    </div>
  );
}

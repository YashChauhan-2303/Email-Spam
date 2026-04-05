import React from 'react';
import styles from './Header.module.css';

const tabs = [
  { id: 'analyzer', label: 'Email Analyzer', icon: '🔍' },
  { id: 'kb',       label: 'Knowledge Base', icon: '🧠' },
  { id: 'how',      label: 'How It Works',   icon: '⚙️'  },
];

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🛡️</span>
          </div>
          <div className={styles.brandText}>
            <h1 className={styles.title}>SpamGuard <span className={styles.titleAccent}>AI</span></h1>
            <p className={styles.subtitle}>Rule-Based Intelligent Agent · Forward Chaining · Classical AI</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className={styles.nav} role="navigation" aria-label="Main navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-selected={activeTab === tab.id}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Gradient divider */}
      <div className={styles.divider} />
    </header>
  );
}

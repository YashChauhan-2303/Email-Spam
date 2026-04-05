import React, { useState, useEffect } from 'react';
import styles from './KnowledgeBase.module.css';

export default function KnowledgeBase() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('http://localhost:5000/api/rules')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => {
        setError('Could not load knowledge base. Ensure backend is running.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.loading}>Loading knowledge base...</div>;
  if (error)   return <div className={styles.error}>{error}</div>;

  const rules = data?.rules || [];
  const heuristics = data?.heuristic_keywords || {};
  const filtered = filter === 'ALL' ? rules : rules.filter(r => r.conclusion === filter);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>🧠 Knowledge Base</h2>
          <p className={styles.pageDesc}>
            The complete set of IF-THEN rules that power the forward-chaining inference engine.
            <br/>
            <span className={styles.mono}>Total rules: {data?.total_rules} · Spam score threshold: {data?.spam_threshold}</span>
          </p>
        </div>
        <div className={styles.filterGroup}>
          {['ALL', 'SPAM', 'PROMOTIONAL', 'NOT_SPAM'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'ALL' ? 'All Rules' : f === 'SPAM' ? '🚨 Spam Rules' : f === 'PROMOTIONAL' ? '🛒 Promo Rules' : '✅ Safe Rules'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.rulesGrid}>
        {filtered.map(rule => (
          <div
            key={rule.id}
            className={`${styles.ruleCard} ${rule.conclusion === 'SPAM' ? styles.ruleCardSpam : rule.conclusion === 'PROMOTIONAL' ? styles.ruleCardPromo : styles.ruleCardSafe}`}
          >
            <div className={styles.ruleCardHeader}>
              <span className={styles.ruleId}>{rule.id}</span>
              <h3 className={styles.ruleName}>{rule.name}</h3>
              <span className={`${styles.ruleConclusion} ${rule.conclusion === 'SPAM' ? styles.conclusionSpam : rule.conclusion === 'PROMOTIONAL' ? styles.conclusionPromo : styles.conclusionSafe}`}>
                {rule.conclusion === 'SPAM' ? '→ SPAM' : rule.conclusion === 'PROMOTIONAL' ? '→ PROMOTIONAL' : '→ NOT SPAM'}
              </span>
            </div>
            <p className={styles.ruleExplanation}>{rule.explanation}</p>
            <div className={styles.ruleScore}>
              Score weight: <strong>{rule.score > 0 ? '+' : ''}{rule.score}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Heuristic Keywords */}
      <div className={styles.heuristicSection}>
        <h3 className={styles.heuristicTitle}>📐 Heuristic Keyword Scores</h3>
        <p className={styles.heuristicDesc}>
          Each keyword earns points toward the heuristic spam score.
          If total score ≥ <code>{data?.spam_threshold}</code>, the email is flagged as spam (secondary check).
        </p>
        <div className={styles.heuristicGrid}>
          {Object.entries(heuristics)
            .sort((a, b) => b[1] - a[1])
            .map(([kw, pts]) => (
              <div key={kw} className={styles.heuristicChip}>
                <span className={styles.heuristicKeyword}>"{kw}"</span>
                <span className={styles.heuristicPts}>+{pts}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

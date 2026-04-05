import React from 'react';
import styles from './ResultPanel.module.css';

export default function ResultPanel({ result, loading, error }) {
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorCard message={error} />;
  if (!result) return <EmptyState />;

  const isSpam = result.result === 'SPAM';
  const isPromo = result.result === 'PROMOTIONAL';

  return (
    <div className={`${styles.panel} ${isSpam ? styles.panelSpam : isPromo ? styles.panelPromo : styles.panelSafe}`}>
      {/* ── Verdict Banner ─────────────────────────────────────────── */}
      <div className={`${styles.verdict} ${isSpam ? styles.verdictSpam : isPromo ? styles.verdictPromo : styles.verdictSafe}`}>
        <div className={styles.verdictIcon}>{isSpam ? '🚨' : isPromo ? '🛒' : '✅'}</div>
        <div className={styles.verdictContent}>
          <div className={styles.verdictLabel}>Classification Result</div>
          <div className={styles.verdictText}>{isSpam ? 'SPAM DETECTED' : isPromo ? 'PROMOTIONAL' : 'NOT SPAM'}</div>
        </div>
        <div className={`${styles.verdictBadge} ${isSpam ? styles.badgeSpam : isPromo ? styles.badgePromo : styles.badgeSafe}`}>
          {result.decision_method}
        </div>
      </div>

      {/* ── Heuristic Score ─────────────────────────────────────────── */}
      <ScoreBar heuristic={result.heuristic} />

      {/* ── Facts Summary ────────────────────────────────────────────── */}
      <FactsSummary facts={result.facts_summary} />

      {/* ── Triggered Rules ──────────────────────────────────────────── */}
      {result.triggered_rules.length > 0 && (
        <TriggeredRules rules={result.triggered_rules} />
      )}

      {/* ── Explanation ──────────────────────────────────────────────── */}
      {result.explanation.length > 0 && (
        <ExplanationList explanation={result.explanation} isSpam={isSpam} isPromo={isPromo} />
      )}

      {result.triggered_rules.length === 0 && (
        <div className={styles.noRules}>
          <span>ℹ️</span>
          No rules were triggered. Email classified as <strong>NOT SPAM</strong> by default.
        </div>
      )}
    </div>
  );
}

/* ── Score Bar ─────────────────────────────────────────────────── */
function ScoreBar({ heuristic }) {
  const { score, threshold, result: hResult, breakdown } = heuristic;
  
  // We dynamically scale the bar. The "max" value of the bar is either 
  // the score itself (if it's huge), or threshold * 1.5 to leave visual headroom.
  const maxScale = Math.max(score, threshold * 1.5);
  const pct = (score / maxScale) * 100;
  const thresholdPct = (threshold / maxScale) * 100;
  const isOver = score >= threshold;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>📐</span>
        <span className={styles.sectionTitle}>Heuristic Spam Score</span>
        <span className={`${styles.scoreBadge} ${isOver ? styles.scoreBadgeSpam : styles.scoreBadgeSafe}`}>
          {score} points (Threshold: {threshold})
        </span>
      </div>

      <div className={styles.progressTrack}>
        <div
          className={`${styles.progressBar} ${isOver ? styles.progressSpam : styles.progressSafe}`}
          style={{ width: `${pct}%` }}
        />
        <div className={styles.progressThreshold} style={{ left: `${thresholdPct}%` }} />
      </div>

      {breakdown.length > 0 && (
        <div className={styles.scoreBreakdown}>
          {breakdown.map((item, i) => (
            <span key={i} className={styles.scoreChip}>
              <span className={styles.scoreKeyword}>"{item.keyword}"</span>
              <span className={styles.scorePoints}>+{item.points}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Facts Summary ─────────────────────────────────────────────── */
function FactsSummary({ facts }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🧩</span>
        <span className={styles.sectionTitle}>Extracted Facts (Percepts)</span>
      </div>
      <div className={styles.factsGrid}>
        <div className={styles.factItem}>
          <span className={styles.factLabel}>Links detected</span>
          <span className={`${styles.factValue} ${facts.link_count > 2 ? styles.factDanger : ''}`}>
            {facts.link_count}
          </span>
        </div>
        <div className={styles.factItem}>
          <span className={styles.factLabel}>Word count</span>
          <span className={styles.factValue}>{facts.word_count}</span>
        </div>
        <div className={styles.factItem}>
          <span className={styles.factLabel}>Trusted sender</span>
          <span className={`${styles.factValue} ${facts.trusted_sender ? styles.factSafe : styles.factNeutral}`}>
            {facts.trusted_sender ? 'Yes ✓' : 'No'}
          </span>
        </div>
        <div className={styles.factItem}>
          <span className={styles.factLabel}>Sender</span>
          <span className={styles.factMono}>{facts.sender || '—'}</span>
        </div>
      </div>

      {facts.keywords_detected.length > 0 && (
        <div className={styles.keywordsWrap}>
          <span className={styles.factLabel}>Keywords found</span>
          <div className={styles.keywords}>
            {facts.keywords_detected.slice(0, 30).map((kw, i) => (
              <span key={i} className={styles.keyword}>{kw}</span>
            ))}
            {facts.keywords_detected.length > 30 && (
              <span className={styles.keyword}>+{facts.keywords_detected.length - 30} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Triggered Rules ───────────────────────────────────────────── */
function TriggeredRules({ rules }) {
  const spamRules   = rules.filter(r => r.conclusion === 'SPAM');
  const promoRules  = rules.filter(r => r.conclusion === 'PROMOTIONAL');
  const safeRules   = rules.filter(r => r.conclusion === 'NOT_SPAM');

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>⚡</span>
        <span className={styles.sectionTitle}>Triggered Rules</span>
        <span className={styles.ruleCount}>{rules.length} rule{rules.length !== 1 ? 's' : ''} fired</span>
      </div>

      <div className={styles.rulesList}>
        {spamRules.map((rule) => (
          <div key={rule.id} className={`${styles.rule} ${styles.ruleSpam}`}>
            <div className={styles.ruleHeader}>
              <span className={styles.ruleId}>{rule.id}</span>
              <span className={styles.ruleName}>{rule.name}</span>
              <span className={styles.ruleScore}>+{rule.score} pts</span>
            </div>
            <p className={styles.ruleExplanation}>{rule.explanation}</p>
          </div>
        ))}
        {promoRules.map((rule) => (
          <div key={rule.id} className={`${styles.rule} ${styles.rulePromo}`}>
            <div className={styles.ruleHeader}>
              <span className={styles.ruleId}>{rule.id}</span>
              <span className={styles.ruleName}>{rule.name}</span>
              <span className={`${styles.ruleScore} ${styles.ruleScorePromo}`}>+{rule.score} pts</span>
            </div>
            <p className={styles.ruleExplanation}>{rule.explanation}</p>
          </div>
        ))}
        {safeRules.map((rule) => (
          <div key={rule.id} className={`${styles.rule} ${styles.ruleSafe}`}>
            <div className={styles.ruleHeader}>
              <span className={styles.ruleId}>{rule.id}</span>
              <span className={styles.ruleName}>{rule.name}</span>
              <span className={`${styles.ruleScore} ${styles.ruleScoreSafe}`}>{rule.score} pts</span>
            </div>
            <p className={styles.ruleExplanation}>{rule.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Explanation List ──────────────────────────────────────────── */
function ExplanationList({ explanation, isSpam, isPromo }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>💬</span>
        <span className={styles.sectionTitle}>Agent Reasoning</span>
      </div>
      <div className={styles.explanationList}>
        {explanation.map((line, i) => (
          <div key={i} className={styles.explanationItem}>
            <span className={styles.explanationBullet}>{isSpam ? '▸' : isPromo ? '•' : '✓'}</span>
            <span className={styles.explanationText}>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Loading Skeleton ──────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className={styles.panel}>
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <div className={styles.loadingTitle}>Running Inference Engine...</div>
        <div className={styles.loadingSteps}>
          <div className={styles.loadingStep}>
            <span className={styles.loadingDot} style={{ animationDelay: '0s' }} />
            Extracting facts from email
          </div>
          <div className={styles.loadingStep}>
            <span className={styles.loadingDot} style={{ animationDelay: '0.3s' }} />
            Evaluating knowledge base rules
          </div>
          <div className={styles.loadingStep}>
            <span className={styles.loadingDot} style={{ animationDelay: '0.6s' }} />
            Running forward chaining algorithm
          </div>
          <div className={styles.loadingStep}>
            <span className={styles.loadingDot} style={{ animationDelay: '0.9s' }} />
            Generating explanation
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Error Card ────────────────────────────────────────────────── */
function ErrorCard({ message }) {
  return (
    <div className={`${styles.panel} ${styles.errorPanel}`}>
      <div className={styles.errorContent}>
        <span className={styles.errorIcon}>⚠️</span>
        <div>
          <div className={styles.errorTitle}>Analysis Error</div>
          <div className={styles.errorMessage}>{message}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Empty State ───────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className={styles.panel}>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🤖</div>
        <div className={styles.emptyTitle}>Agent Ready</div>
        <p className={styles.emptyDesc}>
          Paste an email on the left and click <strong>Classify Email</strong> to run the
          forward-chaining inference engine.
        </p>
        <div className={styles.emptySteps}>
          <div className={styles.emptyStep}><span>1</span> Enter email text</div>
          <div className={styles.emptyStep}><span>2</span> Run classification</div>
          <div className={styles.emptyStep}><span>3</span> View AI reasoning</div>
        </div>
      </div>
    </div>
  );
}

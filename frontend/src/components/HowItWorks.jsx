import React from 'react';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>⚙️ How the Agent Works</h2>
        <p className={styles.desc}>
          Understanding the classical AI architecture powering the SpamGuard inference engine.
        </p>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.stepNum}>1</div>
          <h3 className={styles.cardTitle}>Environment & Percepts</h3>
          <p className={styles.cardText}>
            The agent acts within an <strong>Environment</strong> (the incoming email). 
            It senses this environment via <strong>Percepts</strong> — raw signals like text length, links, and words.
            The <em>Fact Extractor</em> module converts these percepts into a structured array of facts.
          </p>
          <div className={styles.codeBlock}>
            <code>
              {`facts = {
  contains: ["win", "money"],
  link_count: 2,
  trusted_sender: false
}`}
            </code>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.stepNum}>2</div>
          <h3 className={styles.cardTitle}>Knowledge Representation</h3>
          <p className={styles.cardText}>
            The agent's intelligence is stored in a <strong>Knowledge Base</strong>. 
            Unlike Machine Learning, this system relies on explicitly defined <strong>IF-THEN Rules</strong> 
            created by experts, mapping specific fact patterns to logical conclusions.
          </p>
          <div className={styles.codeBlock}>
            <code>
              {`IF facts.contains("win") 
AND facts.contains("money") 
THEN conclusion = SPAM`}
            </code>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.stepNum}>3</div>
          <h3 className={styles.cardTitle}>Forward Chaining Inference</h3>
          <p className={styles.cardText}>
            The <strong>Inference Engine</strong> runs a Forward Chaining algorithm. It loops through the knowledge base, 
            matching conditions against current facts. When a rule triggers, its conclusion is added as a new fact. The system iterates 
            until no new facts can be inferred (reaching a fixed point).
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.stepNum}>4</div>
          <h3 className={styles.cardTitle}>Heuristic Evaluation</h3>
          <p className={styles.cardText}>
            As a fallback or tie-breaker, the agent uses a <strong>Heuristic Function</strong>. 
            It assigns weighted point values to specific keywords. If the cumulative score exceeds a predefined 
            threshold, it provides a supplementary "Spam" classification.
          </p>
        </div>
      </div>
    </div>
  );
}

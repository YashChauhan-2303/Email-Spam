import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import EmailInput from './components/EmailInput';
import ResultPanel from './components/ResultPanel';
import KnowledgeBase from './components/KnowledgeBase';
import HowItWorks from './components/HowItWorks';
import styles from './App.module.css';

const API_BASE = `${import.meta.env.VITE_BACK_API || 'http://localhost:5000'}/api`;

export default function App() {
  const [emailText, setEmailText] = useState('');
  const [sender, setSender]       = useState('');
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState('analyzer'); // 'analyzer' | 'kb' | 'how'

  const analyzeEmail = useCallback(async () => {
    if (!emailText.trim()) {
      setError('Please enter email text to analyze.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailText: emailText.trim(), sender: sender.trim() }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to backend server. Make sure it is running on port 5000.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [emailText, sender]);

  const handleSampleLoad = useCallback((sampleText, sampleSender = '') => {
    setEmailText(sampleText);
    setSender(sampleSender);
    setResult(null);
    setError(null);
  }, []);

  const handleReset = useCallback(() => {
    setEmailText('');
    setSender('');
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className={styles.app}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={styles.main}>
        {activeTab === 'analyzer' && (
          <div className={styles.analyzerLayout}>
            <div className={styles.inputSection}>
              <EmailInput
                emailText={emailText}
                sender={sender}
                onEmailChange={setEmailText}
                onSenderChange={setSender}
                onAnalyze={analyzeEmail}
                onReset={handleReset}
                onSampleLoad={handleSampleLoad}
                loading={loading}
              />
            </div>
            <div className={styles.resultSection}>
              <ResultPanel
                result={result}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        )}

        {activeTab === 'kb' && <KnowledgeBase />}
        {activeTab === 'how' && <HowItWorks />}
      </main>
    </div>
  );
}

import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import EmailInput from './components/EmailInput';
import ResultPanel from './components/ResultPanel';
import KnowledgeBase from './components/KnowledgeBase';
import HowItWorks from './components/HowItWorks';
import styles from './App.module.css';

const API_BASE = `${import.meta.env.VITE_BACK_API}/api`;

export default function App() {
  const [emailText, setEmailText] = useState('');
  const [sender, setSender]       = useState('');
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [isWaking, setIsWaking]   = useState(false);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState('analyzer'); // 'analyzer' | 'kb' | 'how'

  // Wake up the backend on initial load
  useEffect(() => {
    fetch('https://email-spam-kisz.onrender.com/health')
      .then(res => res.json())
      .then(data => console.log('Backend warmed up:', data))
      .catch(err => console.log('Backend warmup failed:', err));
  }, []);

  const analyzeEmail = useCallback(async () => {
    if (!emailText.trim()) {
      setError('Please enter email text to analyze.');
      return;
    }
    setLoading(true);
    setIsWaking(false);
    setError(null);
    setResult(null);

    const wakeTimer = setTimeout(() => {
      setIsWaking(true);
    }, 4000);

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
        setError(`Cannot connect to backend server at ${API_BASE}. It might be down or blocking requests (CORS).`);
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      clearTimeout(wakeTimer);
      setIsWaking(false);
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
                isWaking={isWaking}
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

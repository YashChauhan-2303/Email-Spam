# 📌 SpamGuard AI — Rule-Based Intelligent Agent for Email Classification

---

# 🚀 Overview

SpamGuard AI is a full-stack **Classical Artificial Intelligence** system (not Machine Learning based) built to classify incoming emails into three distinct categories: `SPAM`, `PROMOTIONAL`, and `NOT_SPAM`. 

The system operates strictly as an intelligent agent, relying on a robust **Rule-Based System** powered by a **Forward Chaining Inference Engine**. Unlike modern "black box" neural networks, SpamGuard provides 100% Explainable AI (XAI), detailing the exact logic trace and heuristics used to arrive at its final classification.

---

# 🧠 AI Concepts Used

## 1. Intelligent Agent
* **Environment:** The textual content and metadata of incoming emails.
* **Percepts (Sensors):** The Fact Extraction module acts as the sensor, converting raw textual data into structured atomic facts (e.g., detecting keywords, URLs, trusted senders).
* **Actions (Actuators):** The final classification bucket assigned to the email (`SPAM`, `PROMOTIONAL`, `NOT_SPAM`), accompanied by a logic-trace explanation.

## 2. Knowledge Representation
* **IF–THEN Rules:** Domain expertise is captured explicitly through hardcoded logical rules stored in a structured Knowledge Base.
* Example: `IF contains("report") AND contains("download") THEN conclusion = "PROMOTIONAL"`

## 3. Forward Chaining Algorithm (MAIN)
The core logic driver of the system:
1. **Start with facts:** Populate the working memory with initial percepts.
2. **Match rules:** Iterate over the entire knowledge base to find rules whose conditions (antecedents) are fully satisfied by the current facts.
3. **Fire rules:** Trigger the matched rules, accumulating conclusions and specific scores.
4. **Update facts:** Add the new inferred information back into the working memory.
5. **Repeat:** The cycle loops continuously until reaching a fixed point (no new rules can fire and no new facts can be added).

## 4. Heuristic Function
* **Keyword Scoring System:** Assigns numerical weights to high-risk keywords (e.g., "password" = +3).
* **Secondary Decision Making:** Acts as a continuous scoring tie-breaker or fallback when explicit IF-THEN conditions miss an edge case.

---

# ⚙️ Algorithms Used

* **Forward Chaining Inference** (Primary algorithmic driver looping over the knowledge base).
* **Heuristic Evaluation Function** (Secondary quantitative spam-scoring logic).
* **Rule-Based Inference System** (The expert system architectural pattern governing the flow).

---

# 🏗️ System Architecture

1. **Input:** Raw email text and sender data is submitted via the React frontend.
2. **Fact Extraction:** The Agent's sensors parse the input into clean tokens, counts, and signals.
3. **Rule Engine:** The active rules are matched against the working memory.
4. **Inference:** The Forward Chaining loop fires applicable rules.
5. **Output:** A deterministic and fully explainable decision is returned to the user alongside the triggered rules array.

---

# 🔍 Features

* **Rule-based spam detection:** Reliably flags common spam/phishing patterns.
* **Promotional email classification:** Distinctly categorizes newsletters and marketing blasts natively in the logic core.
* **Explainable AI:** Highlights every single rule that fired, exposing the agent's internal logic trace.
* **Heuristic scoring:** Visually displays the numerical risk score computed dynamically against a defined threshold.
* **Interactive UI:** A highly polished, modern glassmorphic interface to test out rules in real-time.

---

# 💻 Tech Stack

**Frontend:**
* React (Vite)
* CSS Modules (Vanilla CSS, custom design system)

**Backend:**
* Node.js
* Express.js

---

# 🧪 Example

**Input:** 
*"You have won free money! Click here now to claim your prize"*

**Output:** `SPAM`

**Agent Reasoning:**
The forward-chaining agent extracts facts like `contains("win")` and `contains("money")`. These extracted percepts satisfy the `Win + Money Rule` (R01) and `Win + Free Rule` (R03). The engine fires the rules, injecting the conclusion `SPAM` into memory and incrementing the spam threshold score, leading conclusively to the final classification result.

---

# ▶️ How to Run

### Backend

Open a terminal window and navigate to the backend directory:

```bash
cd backend
npm install
npm run dev
```
*(The backend runs on `http://localhost:5000`)*

### Frontend

Open a new terminal window / tab and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on `http://localhost:5173`)*

Finally, click through or visit `http://localhost:5173` in your browser.

---

# 🎯 Key Highlights

* **No Machine Learning used:** Fully deterministic via classical GOFAI (Good Old-Fashioned AI).
* **Fully explainable AI:** Guaranteed transparency compared to black-box models.
* **Based on classical AI concepts:** Strictly adheres to University-level rule-based engineering logic.

---

# 📚 Future Improvements

* Add ML-based secondary classification (Hybrid AI approach).
* Improve automated rule learning (allow the heuristic engine to mutate parameters).
* Add a user feedback system (thumbs up/down) to tune threshold values dynamically.

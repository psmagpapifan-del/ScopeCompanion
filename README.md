# Client Scoping Companion 📱💼

An interactive, high-fidelity scoping companion application designed to bridge the language and technical gap between non-native English-speaking, non-technical founders, and software developers. Styled in a vibrant, tactile **Neo-Brutalist (Stitch/Vibrant Palette) UI** with delightful sound feedback and responsive micro-animations.

---

## 🌟 Key Features & Interactive Modules

### 1. 📂 Layman-Friendly Scoping Prompts
*   **Structured Exploration**: Curated prompt categories covering User Profiles, Notifications, Onboarding, Search, Payments, and Database Requirements.
*   **Copy & Share**: Quick-copy buttons to easily paste requirements into developer communications or documents.

### 2. 📋 Dynamic Questionnaire Board (Scoping Board)
*   **Step-by-Step Discovery**: Prompts founders to answer straightforward questions about their target users, platform choice, offline needs, and core features.
*   **Instant Brief & PDF Generation**: Generates clean, well-formatted, layman-friendly scoping briefs that can be exported directly to PDF or printed.

### 3. 🎯 Interactive Checklist & Milestones
*   **Clear Phase Boundaries**: Breaks down the software lifecycle into simple phases (Planning, MVP Core, Testing, Release).
*   **Gamified Progress**: Check off developer tasks, take phase notes, and export completed milestone outlines.

### 4. 🌎 Layman Jargon Translator (Powered by Gemini AI)
*   **Technical Explainer**: Enter confusing development jargon (like "WebSockets", "OAuth", "API Keys", "Docker") and translate it into clear, simple English (A2/B1 level).
*   **Real-world Analogies**: Auto-generates charming, relatable analogies (such as comparing databases to restaurant kitchens or API keys to hotel entry cards).
*   **Multilingual Support**: Supports native summaries in 10+ languages (Spanish, French, Chinese, Vietnamese, Tagalog, and more).

### 5. 📱 Flutter & Stitch Dev Transition
*   **Ready-to-use Code**: Automatically generates complete, production-ready Flutter/Dart modules representing your customized colors, data schemas, and API connectors.
*   **Direct Developer Handoff**: Instant download/copy buttons for `companion_theme.dart`, `companion_models.dart`, and `companion_api.dart`.

### 6. 🎓 SDLC Founder Help Desk (Powered by Gemini AI)
*   **Always-On Agile Coach**: A dedicated help center where founders can search or type customized questions about Agile, sprints, deployment pipelines, testing, and other complex topics.
*   **Actionable Advice**: Returns plain explanations, daily stories, vocabulary cards, and a checklist of concrete action items the founder should take next.

---

## 🛠️ Tech Stack

*   **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas/Web Audio API (Synthesized feedback).
*   **Backend**: Node.js Express Server, TypeScript (`tsx` runner).
*   **AI Integration**: `@google/genai` (Google GenAI SDK) using the highly stable `gemini-2.5-flash` model with automatic failover logic.

---

## ⚙️ Configuration & Secrets

The application requires a **Gemini API Key** to power the **Layman Jargon Translator** and the **SDLC Founder Help Desk** tabs.

1.  Open **Google AI Studio** or your deployment control panel.
2.  Go to **Settings > Secrets** (or the respective Environment Variables panel).
3.  Add a secret named `GEMINI_API_KEY` and paste your Gemini API key from Google AI Studio.
4.  The server automatically registers this secret on the next request.

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file at the root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
```
The server will start on port **3000** at `http://localhost:3000`.

### 4. Build & Start in Production
```bash
npm run build
npm start
```
This compiles the client-side files into `/dist` and bundles the Express `server.ts` into a fast, standalone CommonJS module `dist/server.cjs` via `esbuild`.

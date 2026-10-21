# ⚡ ClientFlow Dashboard

ClientFlow is a responsive dashboard for freelancers. Firebase Authentication protects the app, and each signed-in account's client records are stored in Firestore. Project and invoice screens and the trend charts currently use clearly labeled sample data.

- **Live dashboard:** https://clientflow-dashboard-dev.vercel.app/

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend / Database:** Firebase Authentication, Firestore
- **Routing & State:** React Router, React Context API
- **Data Visualization:** Recharts
- **UI Feedback:** React Hot Toast
- **Checks:** Vitest, Testing Library, Oxlint, TypeScript

## 🌟 Phase 4 capabilities

- 🔒 **Authentication:** Email/password and Google sign-in, registration, password reset, Firebase error messages, and protected routes.
- ✅ **Validation:** User-visible validation for required fields, email format, password length, client name/company limits, non-negative budgets, and allowed client statuses.
- 👥 **Owner-scoped clients:** Create, search, edit, and delete client records in Firestore. Client reads and writes include the signed-in owner, and the service prevents updates from changing `ownerUid`.
- 🧭 **Resilient UI states:** Loading placeholders, empty and no-match states, save/delete progress, confirmation before deletion, and actionable error feedback.
- 📊 **Dashboard and previews:** Per-user client/project totals plus searchable sample project and invoice screens. Trend charts and preview records are labeled as sample data.
- 🌓 **Responsive UI:** Dark-themed dashboard layout for desktop and smaller screens.

## Local setup

Install dependencies, create the local Firebase environment file, and start Vite:

```bash
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`.

## Firebase environment setup

Create a Firebase web app in the project used by this deployment. Copy `.env.example` to `.env` and fill in every `VITE_FIREBASE_*` value from Firebase project settings:

```dotenv
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Enable Email/Password and Google providers in Firebase Authentication. Add the local development host and the deployed host to Authentication → Settings → Authorized domains. Do not commit `.env`; Vite exposes `VITE_*` values to the browser, so only use Firebase web configuration values there.

Deploy the repository's owner-scoped Firestore rules before enabling client data operations:

```bash
firebase login
firebase use <your-firebase-project-id>
firebase deploy --only firestore:rules
```

## Checks

Run the same checks locally that protect the Phase 4 flow:

```bash
npm test             # Vitest + Testing Library, once
npm run test:watch   # Vitest watch mode during development
npm run lint         # Oxlint
npm run typecheck    # TypeScript, no emit
npm run build        # Production Vite build
```

The tests cover visible login/registration validation, client search, client form validation and Firestore payloads, delete confirmation, owner-scoped reads, and the service's owner immutability rule.

## Deployment

Build locally before deploying:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

For Vercel, import the repository, set the six `VITE_FIREBASE_*` environment variables in the Vercel project settings for the relevant environments, and deploy. `vercel.json` rewrites client-side routes to `index.html`. After changing Firestore rules, run `firebase deploy --only firestore:rules` against the intended Firebase project.

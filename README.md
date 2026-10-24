# ⚡ ClientFlow Dashboard

ClientFlow is a responsive dashboard for freelancers. Firebase Authentication protects the app, and each account's client, project, and invoice records are stored in Firestore. Dashboard trend charts and the small recent-project preview remain clearly labeled sample data.

- **Live dashboard:** https://clientflow-dashboard-dev.vercel.app/

## 🛠️ Tech Stack
* **Frontend:** React, Vite, Tailwind CSS
* **Backend / Database:** Firebase Authentication, Firestore
* **Routing & State:** React Router, React Context API
* **Data Visualization:** Recharts
* **UI Feedback:** React Hot Toast
* **Quality checks:** Oxlint, TypeScript compiler checks, Vitest

## 🌟 Key Features
* 🔒 **Firebase Auth:** Email/password and Google sign-in, registration, password reset, and protected routes.
* 👥 **Client Management:** Create, search, edit, and delete per-user client records in Firestore.
* 📊 **Dashboard:** Per-user client and project totals with live six-month revenue and client-growth trends.
* 🧾 **Project & Invoice Management:** Create, search, filter, edit, and delete per-user project and invoice records in Firestore.
* 🌓 **Responsive UI:** Modern, dark-themed dashboard UI tailored for all screen sizes.
* 💾 **Saved preferences:** Theme and sidebar preferences persist in the browser.
* ♿ **Accessible states:** Dialog semantics, field-level validation messages, and keyboard escape handling.

## Firebase setup

Copy `.env.example` to `.env` for local development and provide the same `VITE_FIREBASE_*` values in Vercel project settings. Deploy the Firestore rules in `firestore.rules` before enabling client, project, or invoice data operations.

```bash
firebase deploy --only firestore:rules
```

## Development checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The production build intentionally keeps Recharts in a separate lazy-loaded
chart chunk. The initial dashboard route is therefore smaller, while the
analytics panels load when the dashboard reaches them.

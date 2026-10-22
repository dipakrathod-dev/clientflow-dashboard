# ⚡ ClientFlow Dashboard

ClientFlow is a responsive dashboard prototype for freelancers. Firebase Authentication protects the app, and each account's client records are stored in Firestore. Project and invoice screens and the trend charts currently use clearly labeled sample data.

- **Live dashboard:** https://clientflow-dashboard-dev.vercel.app/

## 🛠️ Tech Stack
* **Frontend:** React, Vite, Tailwind CSS
* **Backend / Database:** Firebase Authentication, Firestore
* **Routing & State:** React Router, React Context API
* **Data Visualization:** Recharts
* **UI Feedback:** React Hot Toast

## 🌟 Key Features
* 🔒 **Firebase Auth:** Email/password and Google sign-in, registration, password reset, and protected routes.
* 👥 **Client Management:** Create, search, edit, and delete per-user client records in Firestore.
* 📊 **Dashboard:** Per-user client and project totals, with trend charts marked as sample data.
* 🧾 **Preview Screens:** Searchable sample project and invoice lists.
* 🌓 **Responsive UI:** Modern, dark-themed dashboard UI tailored for all screen sizes.

## Firebase setup

Copy `.env.example` to `.env` for local development and provide the same `VITE_FIREBASE_*` values in Vercel project settings. Deploy the Firestore rules in `firestore.rules` before enabling client data operations.

```bash
firebase deploy --only firestore:rules
```

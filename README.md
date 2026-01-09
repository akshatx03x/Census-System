# Census-System

A **secure, privacy-first caste census prototype** built to demonstrate how **technology can support transparent data collection, blockchain-based verification, and AI-driven analytics** for informed and inclusive government policymaking. :contentReference[oaicite:0]{index=0}

📍 **Live Demo:** https://census-system-git-main-akshatx03xs-projects.vercel.app/ :contentReference[oaicite:1]{index=1}

---

## 🧠 Features

- 🔐 **Secure Identity Verification Flow** (simulated)  
  Simulates OTP verification on mobile number and PAN validation for citizen authentication.

- 📝 **Multi-Step Census Data Form**  
  Collects demographic, socio-economic, and caste information securely from users with confirmation steps.

- 🔗 **Blockchain-Based Hash Recording**  
  Uses mocked blockchain hashes to illustrate tamper-proof logging of submitted records.

- 📊 **Admin Dashboard with AI Analytics**  
  Visualizes caste distribution, state-wise trends, and socio-economic insights using interactive charts.

- 📁 **Features**
✅ Add Supabase backend with persistent storage
✅ Secure real authentication (OTP & ID validation)
✅ Real blockchain integration (Ethereum / Hyperledger)
✅ Server-side analytics & caching

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS |
| Mock Backend | Simulated APIs + Static Data |
| Analytics | Chart.js / D3 (frontend visualizations) |
| Blockchain Sim | Mocked transaction hashes for demonstration |
| Deployment | Vercel |

---

## 🚀 What This Prototype Demonstrates

This repository shows a complete **user journey** from login ➝ verification ➝ data submission ➝ visualization, with:

- Privacy-focused UI flows (simulated only, no real user data)  
- Transparent blockchain hash generation (mocked)  
- AI-style analytics dashboards for policy insights  

It showcases how a census system can be built **securely and transparently** using modern web technologies. :contentReference[oaicite:2]{index=2}

---

## 📁 Project Structure


├── public/ # Static assets
├── src/ # Frontend source code
├── supabase/ # Supabase config (if used for mock backend)
├── .env # Environment variables
├── vite.config.ts # Vite build config
├── tailwind.config.ts # Tailwind CSS config
└── README.md # This file

yaml
Copy code

---

## 🛠 Getting Started

### Clone the repo

```bash
git clone https://github.com/akshatx03x/Census-System.git
cd Census-System
Install Dependencies
bash
Copy code
npm install
Run in development mode
bash
Copy code
npm run dev
Build for production
bash
Copy code
npm run build
📊 Expected Flows
User Login & OTP → Simulated authentication

PAN Confirmation → Additional identity check

Census Entry Form → Multi-step capture with progress UI

Blockchain Hash Display → Mock transaction data

Admin Dashboard → Charts and insights with filters

📜 License
This project is open-source and available under the MIT License.

💬 Questions or Feedback?
Feel free to open an issue or submit a pull request!

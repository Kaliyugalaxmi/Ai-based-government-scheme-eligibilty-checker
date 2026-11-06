# 🇮🇳 AI-Based Government Scheme Eligibility Checker

> **AI for Social Good Hackathon Project**
> Find out which government schemes you qualify for in seconds, and know exactly *why*.

🔗 **Live Demo:** [ai-based-government-scheme-eligibil.vercel.app](https://ai-based-government-scheme-eligibil.vercel.app)

---

## 💡 The Problem

India has hundreds of government welfare schemes, but most citizens never benefit from them because:

- They don't know which schemes exist or whether they are eligible.
- Information is scattered across many websites and PDFs.
- Existing tools give a yes/no answer with no explanation.

## ✅ Our Solution

A simple web app where a user enters basic details (age, income, gender, state, occupation) and instantly gets:

- A list of schemes they are **eligible** for
- A **confidence score** for each match
- A **plain-language explanation** of why they qualify (or don't)
- A **side-by-side comparison** of schemes

No jargon. No confusion. No middlemen.

## ✨ Features

| Feature | What it does |
|---|---|
| 🎯 Smart Eligibility Check | Combines fixed rules (age, income, state) with AI matching |
| 📊 Confidence Score | Shows how strongly you fit each scheme (0–100%) |
| 🔍 Explainable AI | Tells you which factor helped or blocked your eligibility |
| ⚖️ Scheme Comparison | Compare benefits and requirements side by side |
| 🔔 Notifications | Get alerts when new relevant schemes are added |
| 🖥️ Dashboard | One place to see all your recommended schemes |

## 🌍 Social Impact

- **Awareness:** Helps people discover benefits they didn't know about.
- **Accessibility:** Free, simple, and usable by anyone.
- **Transparency:** Every result comes with a reason, so users can trust it.
- **Fairness:** Built with bias checks so recommendations don't discriminate by gender, caste, or religion.

## ⚙️ How It Works

```
User Profile  →  Rule-Based Filter  →  AI Matching (Llama 3.3)  →  Explanation  →  Dashboard
```

1. User fills in their profile.
2. Rule engine removes schemes that clearly don't fit.
3. AI model checks the remaining schemes for deeper matches.
4. The system generates a score and a simple explanation.
5. Results appear on the dashboard.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI | Groq API (Llama 3.3 70B Versatile) |
| Hosting | Vercel |

## 📁 Project Structure

```
├── data/        # Government scheme data
├── frontend/    # React app
├── server/      # Node/Express backend + AI integration
└── README.md
```

## 🚀 Run Locally

**Prerequisites:** Node.js v18+, MongoDB (local or Atlas), Groq API key

```bash
# 1. Clone
git clone https://github.com/Kaliyugalaxmi/Ai-based-government-scheme-eligibilty-checker.git
cd Ai-based-government-scheme-eligibilty-checker

# 2. Backend
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_key
```

```bash
node index.js
```

```bash
# 3. Frontend (new terminal)
cd frontend
npm install
npm start
```

Open **http://localhost:3000** 🎉

## 🔮 Future Plans

- 📄 OCR: upload documents to auto-fill your profile
- 🗣️ Multi-language support (Hindi, Marathi, Tamil and more)
- 📱 Mobile app with React Native


Built with ❤️ for the **AI for Social Good** hackathon.

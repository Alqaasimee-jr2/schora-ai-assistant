[README.md](https://github.com/user-attachments/files/27309587/README.md)
<div align="center">

# 🏫 Schora
### AI-Powered School Operations Platform

**IBM Bob Dev Day Hackathon — 2026**

[![Built with IBM watsonx.ai](https://img.shields.io/badge/IBM-watsonx.ai-054ADA?style=for-the-badge&logo=ibm&logoColor=white)](https://www.ibm.com/watsonx)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## What is Schora?

**Schora** turns the chaotic daily reality of school management into a calm, intelligence-driven workflow. School leaders waste hours chasing down teacher performance data, writing weekly reports, and identifying which classrooms need intervention — Schora does all of that automatically using IBM's Granite AI model.

A teacher submits a lesson record. Schora's AI coach generates structured, honest feedback in seconds. By end of week, the school leader opens a single **AI-generated briefing** that names which teachers are thriving, which need coaching, what risks are escalating, and exactly what to do about each one.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 📋 **Lesson Feedback Engine** | AI coaching feedback for teachers — strengths, growth areas, concrete suggestions, and risk flags — generated from lesson records via IBM Granite |
| 📊 **Weekly School Briefing** | Executive-grade summary for school leaders: teacher health scores, top risks, notable wins, and intervention recommendations |
| 👩‍🏫 **Teachers Directory** | Browse and search all teachers with status indicators and performance streaks |
| 📱 **Mobile-First Dashboard** | Full-featured mobile app with live KPI cards, lesson browsing, and one-tap feedback generation |
| 🔁 **Graceful AI Fallback** | API always returns valid JSON even without IBM Cloud credentials — demo-safe by design |

---

## 🏗️ Architecture

```
schora/
├── schora-api/          # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── lessonFeedback.ts     # POST /api/lesson-feedback
│   │   │   └── weeklyBriefing.ts     # POST /api/weekly-briefing
│   │   ├── services/
│   │   │   └── watsonx.ts            # IBM watsonx.ai integration (IAM + Granite)
│   │   ├── types/
│   │   │   └── schemas.ts            # TypeScript interfaces
│   │   └── server.ts
│   ├── tests/
│   └── .env.example
│
└── schora-ui/           # React 18 + TypeScript + Tailwind CSS frontend
    ├── src/
    │   ├── api/
    │   │   └── client.ts             # API client functions
    │   ├── theme/
    │   │   └── tokens.ts             # Centralized design tokens
    │   ├── components/
    │   │   ├── mobile/               # MobileShell, TopBar, BottomNav
    │   │   ├── ui/                   # 9 reusable UI components
    │   │   └── screens/mobile/       # 6 full mobile screens
    │   └── App.tsx
    └── public/index.html
```

### AI Data Flow

```
Teacher Lesson Record
        │
        ▼
POST /api/lesson-feedback
        │
        ▼
IBM IAM Token Exchange (cached)
        │
        ▼
IBM Granite-13B (watsonx.ai)
  → temperature: 0.3
  → max_new_tokens: 600
        │
        ▼ (or fallback stub on failure)
Structured LessonFeedback JSON
        │
        ▼
Weekly Briefing Aggregation
  → temperature: 0.2
  → max_new_tokens: 900
        │
        ▼
School Leader Dashboard
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- IBM Cloud account with watsonx.ai project *(optional — app runs without it)*

### 1. Clone the repo

```bash
git clone https://github.com/your-org/schora.git
cd schora
```

### 2. Backend setup

```bash
cd schora-api
npm install
cp .env.example .env
# Edit .env with your IBM credentials (optional)
npm run dev
# → Running on http://localhost:3001
```

### 3. Frontend setup

```bash
cd ../schora-ui
npm install
npm start
# → Opens http://localhost:3000
```

### 4. Environment variables

```env
# schora-api/.env
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2
```

> **No IBM credentials?** The API falls back to high-quality stub responses automatically. Every endpoint returns `200 OK` with valid JSON — perfect for demos.

---

## 🔌 API Reference

### `POST /api/lesson-feedback`

Generate AI coaching feedback for a teacher's lesson.

**Request body:**
```json
{
  "lesson": {
    "teacher_id": "T001",
    "teacher_name": "Amara Okafor",
    "subject": "Mathematics",
    "date": "2026-05-02",
    "lesson_title": "Introduction to Fractions",
    "objectives": ["Students will understand fractions"],
    "reflection_text": "The lesson went well. Students engaged with pizza examples.",
    "challenges": "Three students were distracted.",
    "successes": "Hands-on activity worked well.",
    "student_engagement_level": "high",
    "behavior_incidents": 2
  }
}
```

**Response:**
```json
{
  "feedback": {
    "lesson_id": "1777744575442",
    "teacher_id": "T001",
    "strengths": ["Clear lesson structure", "Good use of hands-on activities"],
    "areas_for_growth": ["Time management", "Differentiation for struggling learners"],
    "concrete_suggestions": ["Allocate last 10 minutes for assessment"],
    "risk_flags": ["objective_not_met"],
    "overall_tone": "positive",
    "follow_up_questions_for_teacher": ["What would you cut to create more practice time?"],
    "confidence_score": 0.85
  }
}
```

---

### `POST /api/weekly-briefing`

Generate an executive weekly briefing from a list of lesson feedback records.

**Request body:**
```json
{
  "school_leader_id": "SL001",
  "week_start": "2026-04-28",
  "week_end": "2026-05-02",
  "feedback_list": [ /* array of LessonFeedback objects */ ]
}
```

**Response includes:** `teacher_summaries`, `top_risks`, `notable_wins`, `suggested_interventions`, `questions_to_discuss_in_checkin`, `overall_school_health_score`

---

### `GET /api/weekly-briefing/latest`

Retrieve the most recently generated briefing.

---

## 🎨 UI Component Library

Schora ships with 9 reusable, mobile-first UI components:

| Component | Purpose |
|---|---|
| `MetricCard` | KPI display with value, label, and trend |
| `StatusBadge` | Color-coded status: `on_track` / `needs_support` / `at_risk` |
| `InsightCard` | AI insight cards with optional glow effect |
| `TeacherCard` | Teacher profile with score ring, streak, top-performer variant |
| `ScoreRing` | SVG circular progress, color-coded by score range |
| `ProgressMetric` | Horizontal progress bars for evaluation dimensions |
| `ListRowCard` | Single-row list item with title, subtitle, badge |
| `SearchInput` | Search field with Material Symbols icon |
| `Button` | Variants: `primary` / `secondary` / `outline` / `ghost` |

All components use **Tailwind CSS only** — no CSS files, no inline styles. Dark mode is always-on. Touch targets are 44×44px minimum.

---

## 🧪 Testing

```bash
cd schora-api

# Run test suite
npm test

# Manual API test (lesson feedback)
curl -X POST http://localhost:3001/api/lesson-feedback \
  -H "Content-Type: application/json" \
  -d @test-payload.json
```

**Test flow (frontend):**
1. Login → enter any email/password → Dashboard
2. Wait for lessons to load → click **Get Feedback** on any lesson
3. Verify AI feedback renders in Lesson Detail screen
4. Navigate to **Briefing** tab → click **Generate Briefing**
5. Wait 30–60s for full AI generation cycle

---

## 🔐 IBM watsonx.ai Integration

Schora uses IBM's Granite 13B Instruct model via the watsonx.ai inference API. Key implementation details:

- **IAM token exchange** with in-memory caching (auto-refreshes 60s before expiry)
- **Structured JSON prompting** — model instructed to return schema-exact output
- **Conservative temperature** — `0.3` for lesson feedback, `0.2` for briefings (deterministic summaries)
- **Fallback-first design** — every watsonx call is wrapped in try-catch; stub activates on any failure

```typescript
// Resilience pattern used throughout
try {
  const result = await callWatsonx(prompt, parameters);
  return JSON.parse(result);
} catch (error) {
  console.error('watsonx call failed, returning fallback stub:', error);
  return FALLBACK_STUB; // Always returns 200 to client
}
```

---

## 🗺️ Milestones

| Milestone | Status | Description |
|---|---|---|
| M1 — Scaffold & Config | ✅ Complete | TypeScript setup, Express server, route stubs, data schemas |
| M2 — watsonx.ai Integration | ✅ Complete | IBM Granite API calls, IAM token caching, fallback stubs |
| M3 — React Frontend | ✅ Complete | Mobile-first UI, full API integration, 6 screens, 17 components |

---

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| AI Engine | IBM watsonx.ai — Granite 13B Instruct |
| Backend | Node.js, Express, TypeScript |
| Frontend | React 18, TypeScript, Tailwind CSS |
| HTTP Client | Axios |
| Icons | Material Symbols |
| Fonts | Inter, JetBrains Mono |
| Testing | Jest |
| AI Dev Agent | Bob (IBM Code Mode) |

---

## 📄 License

MIT

---

<div align="center">
  <strong>Built for the IBM Bob Dev Day Hackathon · 2026</strong><br/>
  <sub>Powered by IBM watsonx.ai · Granite 13B Instruct</sub>
</div>
